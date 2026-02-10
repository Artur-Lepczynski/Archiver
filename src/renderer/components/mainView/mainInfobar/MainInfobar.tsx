import { DiffTag } from "../../../../main/types/diff.types";
import { DataStatus } from "../../Main";
import Infobar from "../../UI/infobar/Infobar";
import Separator from "../../UI/Separator";
import style from "./MainInfobar.module.css";

interface MainInfobarProps {
  status: DataStatus;
  stats: Record<DiffTag | string, number> | undefined;
}

export default function MainInfobar({ status, stats }: MainInfobarProps) {
  return (
    <Infobar>
      {status === DataStatus.FOLDER_CLOSED && <p className={style.text}>No folder selected</p>}
      {status === DataStatus.DIFFING && <p className={style.text}>Working...</p>}
      {status === DataStatus.FOLDER_OPENED && stats && (
        <>
          <p className={style.text} title="Total elements in both folders">
            Total: {stats.TOTAL}
          </p>
          <Separator className={style.separator} orientation="vertical" />
          <p className={style.text} title="Total elements in source folder">
            Source: {stats.SOURCE_NODES}
          </p>
          <p className={style.text} title="Total archived elements">
            • Archived: <span className={style.textArchived}>{stats.OK}</span>
          </p>
          <p className={style.text} title="Total non-archived elements">
            • Missing: <span className={style.textMissing}>{stats.MISSING}</span>
          </p>
          <p className={style.text} title="Total archived folders with non-archived elements">
            • Missing files: <span className={style.textMissingFiles}>{stats.MISSING_FILES}</span>
          </p>
          <Separator className={style.separator} orientation="vertical" />
          <p className={style.text} title="Total elements in archive folder">
            Archive: {stats.ARCHIVE_NODES}
          </p>
          <p className={style.text} title="Total elements present in source folder">
            • In source: <span className={style.textNone}>{stats.NONE}</span>
          </p>
          <p className={style.text} title="Total elements not in source folder">
            • Extra: <span className={style.textExtra}>{stats.EXTRA}</span>
          </p>
          <p
            className={style.text}
            title="Total folders present in source folder with files not present"
          >
            • Extra files: <span className={style.textExtraFiles}>{stats.EXTRA_FILES}</span>
          </p>
          <Separator className={style.separator} orientation="vertical" />
        </>
      )}
    </Infobar>
  );
}
