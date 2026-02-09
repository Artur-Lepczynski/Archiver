import fs from "fs";
import { RawNode } from "../types/diff.types";
import path from "path";

export function countNodes(entryNode: RawNode): number {
  if (!entryNode.children) return 1;
  return entryNode.children.reduce((acc, child) => acc + countNodes(child), 1);
}

export function countNodesFromPath(rootPath: string) {
  let count = 0;
  traverse(rootPath);
  function traverse(rootPath: string) {
    const stats = fs.statSync(rootPath);
    count++;
    if (stats.isDirectory())
      fs.readdirSync(rootPath).forEach((child) => traverse(path.join(rootPath, child)));
  }
  return count;
}
