import { ReactElement } from "react";
import { DiffNode } from "../../../../main/types/diff.types";
import style from "./FolderDisplay.module.css";
import FolderInfobar from "./FolderInfobar";

interface FolderDisplayProps {
  toolbar: ReactElement;
  node: DiffNode | undefined;
  hoveredElement?: string;
  folder: "archive" | "source";
}

export default function FolderDisplay({
  toolbar,
  node,
  folder,
  hoveredElement,
}: FolderDisplayProps) {
  return (
    <div className={style.wrapper}>
      {toolbar}
      <div className={style.path}>
        <p>{node?.path}</p>
      </div>
      <div className={style.main}>
        {node?.children?.map((child) => (
          <p>
            {child.name} {child.extension} {child.type} {child.tag}
          </p>
        ))}
      </div>
      <FolderInfobar folder={folder} node={node} />
    </div>
  );
}
