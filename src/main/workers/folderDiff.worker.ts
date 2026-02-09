import { parentPort } from "worker_threads";
import { buildRawTree } from "../fs/treeBuilder";
import { diffFolders } from "../services/folderDiff.service";
import { WorkerMessage } from "../types/workerMessage.types";

parentPort?.on("message", ({ sourcePath, archivePath }) => {
  let progressMessage: WorkerMessage = { type: "progress", message: "Counting source elements" };
  parentPort?.postMessage(progressMessage);
  const { result: sourceTree, totalNodeCount: sourceNodeCount } = buildRawTree(
    sourcePath,
    reportProgress("Creating source tree"),
  );

  progressMessage = { type: "progress", message: "Counting archive elements" };
  parentPort?.postMessage(progressMessage);
  const { result: archiveTree, totalNodeCount: archiveNodeCount } = buildRawTree(
    archivePath,
    reportProgress("Creating archive tree"),
  );

  const result = diffFolders(sourceTree, archiveTree, reportProgress("Diffing trees like a baws"));
  result.stats.SOURCE_NODES = sourceNodeCount;
  result.stats.ARCHIVE_NODES = archiveNodeCount;

  const doneMessage: WorkerMessage = { type: "done", result };
  parentPort?.postMessage(doneMessage);
});

function reportProgress(message: string) {
  return (processed: number, total: number) => {
    // console.log("\tprocessing:", processed, "/", total, "%", Math.floor((processed / total) * 100));
    const progressMessage = {
      type: "progress",
      message,
      value: Math.floor((processed / total) * 100),
    };
    parentPort?.postMessage(progressMessage);
  };
}
