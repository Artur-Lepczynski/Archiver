/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from "path";
import { app, BrowserWindow, shell, ipcMain, dialog } from "electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
import MenuBuilder from "./menu";
import { resolveHtmlPath } from "./util";
import { diffFolders } from "./services/folderDiff.service";
import { buildRawTree } from "./fs/treeBuilder";
import { DiffNode } from "./types/diff.types";
import { Worker } from "worker_threads";
import { fileURLToPath } from "url";
import { WorkerMessage } from "./types/workerMessage.types";

class AppUpdater {
  constructor() {
    log.transports.file.level = "info";
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let openNewFolderModalWindow: BrowserWindow | null = null;
let aboutModalWindow: BrowserWindow | null = null;

ipcMain.on("ipc-example", async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply("ipc-example", msgTemplate("pong"));
});

if (process.env.NODE_ENV === "production") {
  const sourceMapSupport = require("source-map-support");
  sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";

// Commented out to prevent dev tools from auto-opening
// if (isDebug) {
//   require('electron-debug').default();
// }

const installExtensions = async () => {
  const installer = require("electron-devtools-installer");
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ["REACT_DEVELOPER_TOOLS"];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, "assets")
    : path.join(__dirname, "../../assets");

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1920,
    height: 1080,
    icon: getAssetPath("icon.png"),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, "preload.js")
        : path.join(__dirname, "../../.erb/dll/preload.js"),
    },
  });

  mainWindow.loadURL(resolveHtmlPath("index.html"));

  mainWindow.on("ready-to-show", () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.setTitle(`Archiver ${app.getVersion()}`);
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: "deny" };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on("window-all-closed", () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on("activate", () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

function getAssetPath(...paths: string[]): string {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, "assets")
    : path.join(__dirname, "../../assets");
  return path.join(RESOURCES_PATH, ...paths);
}

ipcMain.handle("get-version", async () => app.getVersion());

function openNewFolderModal() {
  if (openNewFolderModalWindow || !mainWindow) return;

  openNewFolderModalWindow = new BrowserWindow({
    width: 900,
    height: 255,
    resizable: false,
    parent: mainWindow,
    modal: true,
    show: false,
    minimizable: false,
    maximizable: false,
    icon: getAssetPath("icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      additionalArguments: ["--window=newFolderModal"],
    },
  });

  openNewFolderModalWindow.loadURL(resolveHtmlPath("index.html"));

  openNewFolderModalWindow.once("ready-to-show", () => {
    openNewFolderModalWindow?.setTitle("Open new folder");
    openNewFolderModalWindow?.show();
  });

  openNewFolderModalWindow.on("closed", () => {
    openNewFolderModalWindow = null;
  });
}

ipcMain.on("close-new-folder-modal", (_event, value: string) => {
  openNewFolderModalWindow?.close();
});

ipcMain.handle("open-new-folder-modal", openNewFolderModal);

let currentArchivePath: string | undefined = undefined;
let currentCopyPath: string | undefined = undefined;

async function openNewFolderModalArchiveSelect() {
  const newArchivePath = chooseNewFolderFile("Choose archive file");
  if (newArchivePath) currentArchivePath = newArchivePath;
  return currentArchivePath;
}

async function openNewFolderModalCopySelect() {
  const newCopyPath = chooseNewFolderFile("Choose copy file");
  if (newCopyPath) currentCopyPath = newCopyPath;
  return currentCopyPath;
}

ipcMain.handle("open-new-folder-modal-archive-select", openNewFolderModalArchiveSelect);

ipcMain.handle("open-new-folder-modal-copy-select", openNewFolderModalCopySelect);

function chooseNewFolderFile(title: string) {
  if (!openNewFolderModalWindow) return;

  const paths = dialog.showOpenDialogSync(openNewFolderModalWindow, {
    title,
    properties: ["openDirectory", "showHiddenFiles", "dontAddToRecent"],
  });

  return paths ? paths[0] : undefined;
}

function openAboutModal() {
  if (aboutModalWindow || !mainWindow) return;

  aboutModalWindow = new BrowserWindow({
    width: 500,
    height: 750,
    resizable: false,
    parent: mainWindow,
    modal: true,
    show: false,
    minimizable: false,
    maximizable: false,
    icon: getAssetPath("icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      additionalArguments: ["--window=aboutModal"],
    },
  });

  aboutModalWindow.loadURL(resolveHtmlPath("index.html"));

  aboutModalWindow.once("ready-to-show", () => {
    aboutModalWindow?.setTitle("About");
    aboutModalWindow?.show();
  });

  aboutModalWindow.on("closed", () => {
    aboutModalWindow = null;
  });
}

ipcMain.on("close-about-modal", (_event, value: string) => {
  aboutModalWindow?.close();
});

ipcMain.handle("open-about-modal", openAboutModal);

ipcMain.handle("diff-folders", async (_, sourcePath: string, archivePath: string) => {
  return new Promise<WorkerMessage>((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, "folderDiffWorker.bundle.dev.js"));
    worker.postMessage({ sourcePath, archivePath });

    worker.on("message", (message: WorkerMessage) => {
      if (message.type === "done") {
        resolve(message);
      } else if (message.type === "progress") {
        //TODO: send to ui
        console.log("PROGRESS:", message.message, "val:", message.value);
      } else if (message.type === "error") {
        reject(new Error());
      }
    });
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with code ${code}`));
    });
  }).then((results) => {
    if (results.type === "done") {
      console.log("SOURCE:");
      readFiles(results.result.source);

      console.log("\nARCHIVE:");
      readFiles(results.result.archive);
    }
  });
});

function readFiles(node: DiffNode) {
  console.log(node.extension, node.name, node.type, node.tag);
  node.children?.forEach((node) => readFiles(node));
}
