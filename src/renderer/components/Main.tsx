import { useEffect, useReducer } from "react";
import Infobar from "./infobar/Infobar";
import style from "./Main.module.css";
import MainDisplay from "./mainDisplay/mainDisplay";
import Toolbar from "./toolbar/Toolbar";
import { WorkerMessage } from "../../main/types/workerMessage.types";
import { DiffResult } from "../../main/types/diff.types";

export enum DataStatus {
  FOLDER_CLOSED = "FOLDER_CLOSED",
  DIFFING = "DIFFING",
  FOLDER_OPENED = "FOLDER_OPENED",
}

export interface DiffDataType {
  status: DataStatus;
  message?: WorkerMessage;
  result?: DiffResult;
}

type DiffAction =
  | { type: "DIFF_PROGRESS"; payload: { message: WorkerMessage } }
  | { type: "DIFF_DONE"; payload: { result: DiffResult } };

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
    };
  }
  return prevState;
}

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

  return (
    <div className={style.main}>
      <Toolbar />
      <MainDisplay data={diffData} />
      <Infobar />
    </div>
  );
}
