import fs from "fs";
import { RawNode } from "../types/diff.types";
import path from "path";
import { countNodesFromPath } from "../utils/tree.utils";

export function buildRawTree(
  rootPath: string,
  reportProgress: (processed: number, total: number) => void,
) {
  const totalNodeCount = countNodesFromPath(rootPath);
  let currentProcessed = 0;
  let lastReportedPercent = 0;

  const result = buildRawTreeInternal(rootPath);

  return { result, totalNodeCount };

  function progressStep() {
    currentProcessed++;
    const percent = Math.floor((currentProcessed / totalNodeCount) * 100);
    if (percent > lastReportedPercent) {
      lastReportedPercent = percent;
      reportProgress(currentProcessed, totalNodeCount);
    }
  }

  function buildRawTreeInternal(rootPath: string) {
    progressStep();

    const stats = fs.statSync(rootPath);
    const extension = path.extname(rootPath);
    const name = path.basename(rootPath);

    const node: RawNode = {
      name,
      type: stats.isDirectory() ? "dir" : "file",
      extension: stats.isDirectory() ? "" : extension,
    };

    if (stats.isDirectory()) {
      node.children = fs.readdirSync(rootPath).map((child) => {
        return buildRawTreeInternal(path.join(rootPath, child));
      });
    }

    return node;
  }
}
