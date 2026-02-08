import style from "./mainDisplay.module.css";
import { DataStatus, DiffDataType } from "../Main";

interface MainDisplayProps {
  data: DiffDataType;
}

export default function MainDisplay({ data }: MainDisplayProps) {
  return (
    <main className={`${style.mainDisplay} ${style.mainDisplayNoFolder}`}>
      {data.status === DataStatus.FOLDER_CLOSED && <p>Please select a folder</p>}
      {data.status === DataStatus.DIFFING && data.message?.type === "progress" && (
        <p>
          {data.message?.message} {data.message?.value || ""}
        </p>
      )}
      {data.status === DataStatus.FOLDER_OPENED && (
        <p>
          Open! source - {data.result?.source.name} archive - {data.result?.archive.name}
        </p>
      )}
    </main>
  );
}
