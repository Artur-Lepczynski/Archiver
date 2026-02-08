import { ElectronHandler } from "../main/preload";
import { DiffResult } from "../main/types/diff.types";
import { WorkerMessage } from "../main/types/workerMessage.types";

interface DiffAPI {
  onProgress: (callback: (message: WorkerMessage) => void) => void;
  onDone: (callback: (result: DiffResult) => void) => void;
}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    diffAPI: DiffAPI;
  }
}

export {};
