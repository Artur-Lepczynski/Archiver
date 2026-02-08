import { parentPort } from "worker_threads";
import { buildRawTree } from "../fs/treeBuilder";
import { diffFolders } from "../services/folderDiff.service";
import { WorkerMessage } from "../types/workerMessage.types";

parentPort?.on("message", ({ sourcePath, archivePath }) => {
  let progressMessage: WorkerMessage = { type: "progress", message: "Creating source tree" };
  parentPort?.postMessage(progressMessage);
  const sourceTree = buildRawTree(sourcePath);

  progressMessage = { type: "progress", message: "Creating archive tree" };
  parentPort?.postMessage(progressMessage);
  const archiveTree = buildRawTree(archivePath);

  const result = diffFolders(sourceTree, archiveTree, (processed, total) => {
    // console.log("\tprocessing:", processed, "/", total, "%", Math.floor((processed / total) * 100));
    progressMessage = {
      type: "progress",
      message: "Diffing trees like a baws 😎",
      value: Math.floor((processed / total) * 100),
    };
    parentPort?.postMessage(progressMessage);
  });

  const doneMessage: WorkerMessage = { type: "done", result };
  parentPort?.postMessage(doneMessage);
});
