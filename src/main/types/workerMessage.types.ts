import { DiffResult } from "./diff.types";

export type WorkerMessage =
  | { type: "progress"; message: string; value?: number }
  | { type: "done"; result: DiffResult }
  | { type: "error"; message: string };
