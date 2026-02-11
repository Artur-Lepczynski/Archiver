// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { DiffResult } from "./types/diff.types";
import { WorkerMessage } from "./types/workerMessage.types";

export type Channels = "ipc-example";

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  openNewFolderModal: (): Promise<void> => ipcRenderer.invoke("open-new-folder-modal"),
  closeNewFolderModal: (): void => ipcRenderer.send("close-new-folder-modal"),
  isNewFolderModal: process.argv.includes("--window=newFolderModal"),
  openNewFolderModalArchiveSelect: (): Promise<string | undefined> =>
    ipcRenderer.invoke("open-new-folder-modal-archive-select"),
  openNewFolderModalCopySelect: (): Promise<string | undefined> =>
    ipcRenderer.invoke("open-new-folder-modal-copy-select"),
  isAboutModal: process.argv.includes("--window=aboutModal"),
  openAboutModal: (): Promise<void> => ipcRenderer.invoke("open-about-modal"),
  closeAboutModal: (): void => ipcRenderer.send("close-about-modal"),
  getVersion: (): Promise<string> => ipcRenderer.invoke("get-version"),
  diffFolders: (sourcePath: string, archivePath: string): Promise<DiffResult> =>
    ipcRenderer.invoke("diff-folders", sourcePath, archivePath),
};

const diffAPIHandler = {
  onProgress: (callback: (message: WorkerMessage) => void) => {
    ipcRenderer.on("diff-progress", (_, value) => {
      callback(value);
    });
  },
  onDone: (callback: (result: DiffResult) => void) => {
    ipcRenderer.on("diff-done", (_, value) => {
      callback(value);
    });
  },
};

const settingsHandler = {
  getLastPaths(): Promise<{ lastSourcePath: string; lastArchivePath: string }> {
    return ipcRenderer.invoke("settings:get-last-folder-paths");
  },
  setLastPaths(sourcePath: string, archivePath: string) {
    ipcRenderer.invoke("settings:set-last-folder-paths", sourcePath, archivePath);
  },
};

contextBridge.exposeInMainWorld("electron", electronHandler);
contextBridge.exposeInMainWorld("diffAPI", diffAPIHandler);
contextBridge.exposeInMainWorld("settingsAPI", settingsHandler);

export type ElectronHandler = typeof electronHandler;
