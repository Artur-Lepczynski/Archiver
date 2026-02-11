import fs from "fs";
import { RawNode } from "../types/diff.types";
import path from "path";
import { countNodesFromPath } from "../utils/tree.utils";
import { resolveFileType } from "friendly-mimes";
import { getSize } from "../utils/file.utils";

export function buildRawTree(
  rootPath: string,
  reportProgress: (processed: number, total: number) => void,
) {
  const totalNodeCount = countNodesFromPath(rootPath);
  let currentProcessed = 0;
  let lastReportedPercent = 0;
  const friendlyNameCache = new Map<string, string>();

  const result = buildRawTreeInternal(rootPath);

  return { result, totalNodeCount: totalNodeCount };

  function getFriendlyName(extension: string) {
    if (friendlyNameCache.has(extension)) {
      return friendlyNameCache.get(extension);
    } else {
      const friendlyName = resolveFileType(extension).name;
      friendlyNameCache.set(extension, friendlyName);
      return friendlyName;
    }
  }

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

    const node: Partial<RawNode> = {
      name,
      path: rootPath,
      createdDate: stats.birthtime,
      modifiedDate: stats.mtime,
    };

    if (stats.isDirectory()) {
      node.type = "dir";
      node.friendlyName = "File folder";
      node.children = fs.readdirSync(rootPath).map((child) => {
        return buildRawTreeInternal(path.join(rootPath, child));
      });
    } else if (stats.isFile()) {
      node.type = "file";
      node.extension = extension;
      node.sizeString = getSize(stats.size);
      node.friendlyName = getFriendlyName(extension);
    }

    return node as RawNode;
  }
}
