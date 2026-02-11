import { ipcMain } from "electron";
import { settingsStore } from "./settingsStore";

export function registerSettingsIpc() {
  ipcMain.handle("settings:get-last-folder-paths", () => {
    return {
      lastSourcePath: settingsStore.get("lastSourcePath") as string,
      lastArchivePath: settingsStore.get("lastArchivePath") as string,
    };
  });

  ipcMain.handle(
    "settings:set-last-folder-paths",
    (_event, sourcePath: string, archivePath: string) => {
      settingsStore.set("lastSourcePath", sourcePath);
      settingsStore.set("lastArchivePath", archivePath);
    },
  );
}
