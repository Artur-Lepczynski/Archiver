import style from "./mainDisplay.module.css";
import { DataStatus, DiffDataType } from "../../Main";
import { PacmanLoader } from "react-spinners";
import ProgressBar from "../../UI/ProgressBar";
import GenericButton from "../../UI/GenericButton";

interface MainDisplayProps {
  data: DiffDataType;
}

export default function MainDisplay({ data }: MainDisplayProps) {
  return (
    <main className={`${style.mainDisplay} ${style.mainDisplayNoFolder}`}>
      {data.status === DataStatus.FOLDER_CLOSED && <p className={style.mainText}>Please select a source folder and an archive folder</p>}
      {data.status === DataStatus.DIFFING && data.message?.type === "progress" && (
        <>
        <PacmanLoader size={20} color="#a0a0a0" speedMultiplier={1.3}/>
        <ProgressBar className={style.loadingBar} percentage={data.message.value || 0}/>
        <p className={style.mainText}>{data.message.message}</p>
        <GenericButton className={style.cancelButton}>Cancel</GenericButton>
        </>
      )}
      {data.status === DataStatus.FOLDER_OPENED && (
        <p>
          Open! source - {data.result?.source.name} archive - {data.result?.archive.name}
        </p>
      )}
    </main>
  );
}
