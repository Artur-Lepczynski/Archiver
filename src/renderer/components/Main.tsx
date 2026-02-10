import { useEffect, useReducer, useRef } from "react";
import style from "./Main.module.css";
import { WorkerMessage } from "../../main/types/workerMessage.types";
import { DiffNode, DiffResult, DiffTag } from "../../main/types/diff.types";
import MainInfobar from "./mainView/mainInfobar/MainInfobar";
import MainToolbar from "./mainView/mainToolbar/MainToolbar";
import MainDisplay from "./mainView/mainDisplay/mainDisplay";

export enum DataStatus {
  FOLDER_CLOSED = "FOLDER_CLOSED",
  DIFFING = "DIFFING",
  FOLDER_OPENED = "FOLDER_OPENED",
}

export interface DiffDataType {
  status: DataStatus;
  message?: WorkerMessage;
  result?: DiffResult;
  currentSource?: DiffNode;
  currentArchive?: DiffNode;
}

type DiffAction =
  | { type: "DIFF_PROGRESS"; payload: { message: WorkerMessage } }
  | { type: "DIFF_DONE"; payload: { result: DiffResult } }
  | { type: "RESET" };

function diffDataReducer(prevState: DiffDataType, action: DiffAction): DiffDataType {
  if (action.type === "DIFF_PROGRESS") {
    return {
      ...prevState,
      status: DataStatus.DIFFING,
      message: action.payload.message,
    };
  } else if (action.type === "DIFF_DONE") {
    return {
      ...prevState,
      status: DataStatus.FOLDER_OPENED,
      result: action.payload.result,
      currentSource: action.payload.result.source,
      currentArchive: action.payload.result.archive,
    };
  } else if (action.type === "RESET") {
    return {
      status: DataStatus.FOLDER_CLOSED,
    };
  }
  return prevState;
}

// const dummyDiffData: DiffDataType = {
//   status: DataStatus.FOLDER_OPENED,
//   result: {
//     source: {
//       name: "source",
//       type: "dir",
//       tag: DiffTag.OK,
//       children: [
//         { name: "file1.txt", type: "file", extension: "txt", tag: DiffTag.OK },
//         { name: "file2.jpg", type: "file", extension: "jpg", tag: DiffTag.MISSING },
//         { name: "subfolder", type: "dir", tag: DiffTag.OK, children: [] },
//       ],
//     },
//     archive: {
//       name: "archive",
//       type: "dir",
//       tag: DiffTag.OK,
//       children: [
//         { name: "file1.txt", type: "file", extension: "txt", tag: DiffTag.OK },
//         { name: "subfolder", type: "dir", tag: DiffTag.NONE, children: [] },
//       ],
//     },
//     stats: {
//       TOTAL: 12,
//       [DiffTag.OK]: 5,
//       [DiffTag.MISSING]: 1,
//       [DiffTag.EXTRA]: 0,
//       [DiffTag.NONE]: 1,
//       [DiffTag.MISSING_FILES]: 0,
//       [DiffTag.EXTRA_FILES]: 0,
//     },
//   },
//   currentSource: {
//     name: "source",
//     type: "dir",
//     tag: DiffTag.OK,
//     children: [
//       { name: "file1.txt", type: "file", extension: "txt", tag: DiffTag.OK },
//       { name: "file2.jpg", type: "file", extension: "jpg", tag: DiffTag.MISSING },
//       { name: "subfolder", type: "dir", tag: DiffTag.OK, children: [] },
//     ],
//   },
//   currentArchive: {
//     name: "archive",
//     type: "dir",
//     tag: DiffTag.OK,
//     children: [
//       { name: "file1.txt", type: "file", extension: "txt", tag: DiffTag.OK },
//       { name: "file2.jpg", type: "file", extension: "jpg", tag: DiffTag.MISSING },
//       { name: "subfolder", type: "dir", tag: DiffTag.OK, children: [] },
//     ],
//   },
// };

export default function Main() {
  const [diffData, dispatchDiffData] = useReducer(diffDataReducer, {
    status: DataStatus.FOLDER_CLOSED,
  });

  useEffect(() => {
    window.diffAPI.onProgress((message) => {
      dispatchDiffData({ type: "DIFF_PROGRESS", payload: { message } });
    });
    window.diffAPI.onDone((result) => {
      dispatchDiffData({ type: "DIFF_DONE", payload: { result } });
    });
  }, []);

  function handleReset() {
    dispatchDiffData({ type: "RESET" });
  }

  return (
    <div className={style.main}>
      <MainToolbar onReset={handleReset} />
      <MainDisplay data={diffData} />
      <MainInfobar status={diffData.status} stats={diffData.result?.stats} />
    </div>
  );
}
