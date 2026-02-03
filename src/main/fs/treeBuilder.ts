import fs from "fs";
import { RawNode } from "../types/diff.types";
import path from "path";

export function buildRawTree(rootPath: string) {
  const stats = fs.statSync(rootPath);

  const extension = path.extname(rootPath) || "";
  const name = path.basename(rootPath, extension);

  const node: RawNode = {
    name,
    type: stats.isDirectory() ? "dir" : "file",
  };

  if (stats.isFile()) {
    node.extension = extension;
  } else {
    node.children = fs.readdirSync(rootPath).map((child) => {
      return buildRawTree(path.join(rootPath, child));
    });
  }

  return node;
}
