export enum DiffTag {
  OK = "OK",
  MISSING = "MISSING",
  MISSING_FILES = "MISSING_FILES",
  EXTRA = "EXTRA",
  EXTRA_FILES = "EXTRA_FILES",
  NONE = "NONE",
}

export interface RawNode {
  name: string;
  type: "file" | "dir";
  path: string;
  extension?: string;
  children?: RawNode[];
}

export interface DiffNode extends RawNode {
  tag: DiffTag;
  children?: DiffNode[];
}

export interface DiffResult {
  source: DiffNode;
  archive: DiffNode;
  stats: Record<DiffTag | string, number>;
}
