import { DiffNode } from "./diff.types";

export type WorkerMessage =
  | { type: "progress"; message: string, value?: number }
  | { type: "done"; result: { source: DiffNode; archive: DiffNode } }
  | { type: "error"; message: string };
