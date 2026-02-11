// @ts-expect-error - webpack handles ESM/CJS interop
import Store from "electron-store";

const schema = {
  lastSourcePath: {
    type: "string",
    default: "",
  },
  lastArchivePath: {
    type: "string",
    default: "",
  },
};

export const settingsStore = new Store({ schema });
