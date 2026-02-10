import { useMemo } from "react";
import { DiffNode, DiffTag } from "../../../../main/types/diff.types";
import style from "./FolderInfobar.module.css";
import Infobar from "../../UI/infobar/Infobar";
import Separator from "../../UI/Separator";

interface FolderInfobarProps {
  folder: string;
  node: DiffNode | undefined;
}

export default function FolderInfobar({ folder, node }: FolderInfobarProps) {
  const stats = useMemo(() => getStats(node?.children ?? []), [node]);
  return (
    <Infobar>
      {folder === "source" && (
        <>
          <p className={style.text} title="Total elements in current folder">
            Total: {node?.children?.length}
          </p>
          <Separator className={style.separator} orientation="vertical" />
          <p className={style.text} title="Total archived elements in current folder">
            Archived: <span className={style.textArchived}>{stats.OK}</span>
          </p>
          <p className={style.text} title="Total non-archived elements in current folder">
            • Missing: <span className={style.textMissing}>{stats.MISSING}</span>
          </p>
          <p
            className={style.text}
            title="Total archived folders with non-archived elements in current folder"
          >
            • Missing files: <span className={style.textMissingFiles}>{stats.MISSING_FILES}</span>
          </p>
        </>
      )}
      {folder === "archive" && (
        <>
          <p className={style.text} title="Total elements in current folder">
            Total: {node?.children?.length}
          </p>
          <Separator className={style.separator} orientation="vertical" />
          <p
            className={style.text}
            title="Total elements in current folder present in source folder"
          >
            In source: <span className={style.textNone}>{stats.NONE}</span>
          </p>
          <p className={style.text} title="Total elements in current folder not in source folder">
            • Extra: <span className={style.textExtra}>{stats.EXTRA}</span>
          </p>
          <p
            className={style.text}
            title="Total folders in current folder present in source folder with files not present"
          >
            • Extra files: <span className={style.textExtraFiles}>{stats.EXTRA_FILES}</span>
          </p>
        </>
      )}
    </Infobar>
  );
}

function getStats(children: DiffNode[]) {
  const result = {
    [DiffTag.NONE]: 0,
    [DiffTag.OK]: 0,
    [DiffTag.MISSING]: 0,
    [DiffTag.MISSING_FILES]: 0,
    [DiffTag.EXTRA]: 0,
    [DiffTag.EXTRA_FILES]: 0,
  };

  children?.forEach((child) => {
    result[child.tag]++;
  });

  return result;
}
