// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { DiffNode } from "./types/diff.types";

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
  diffFolders: (
    sourcePath: string,
    archivePath: string,
  ): Promise<{ source: DiffNode; archive: DiffNode }> =>
    ipcRenderer.invoke("diff-folders", sourcePath, archivePath),
};

contextBridge.exposeInMainWorld("electron", electronHandler);

export type ElectronHandler = typeof electronHandler;
