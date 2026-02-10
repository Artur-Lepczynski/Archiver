import style from "./mainDisplay.module.css";
import { DataStatus, DiffDataType } from "../../Main";
import { PacmanLoader } from "react-spinners";
import ProgressBar from "../../UI/ProgressBar";
import GenericButton from "../../UI/GenericButton";
// @ts-expect-error - webpack handles ESM/CJS interop
import { Group, Panel, Separator } from "react-resizable-panels";
import FolderDisplay from "./FolderDisplay";
import Toolbar from "../../UI/toolbar/Toolbar";
import ToolbarGroup from "../../UI/toolbar/ToolbarGroup";
import ToolBarButton from "../../UI/toolbar/ToolbarButton";
import undoIcon from "../../../assets/icons/arrow-left.svg";
import redoIcon from "../../../assets/icons/arrow-right.svg";
import upIcon from "../../../assets/icons/arrow-turn-up.svg";
import ToolbarSeparator from "../../UI/toolbar/ToolbarSeparator";
import ToolbarSpacer from "../../UI/toolbar/ToolbarSpacer";

interface MainDisplayProps {
  data: DiffDataType;
}

export default function MainDisplay({ data }: MainDisplayProps) {
  const sourceToolbar = (
    <Toolbar>
      <ToolbarGroup>
        <ToolBarButton type="button" icon={undoIcon} aria-label="Undo" title="Undo" />
        <ToolBarButton type="button" icon={redoIcon} aria-label="Redo" title="Redo" disabled />
        <ToolBarButton type="button" icon={upIcon} aria-label="Go up" title="Go up" />
      </ToolbarGroup>
      <ToolbarSpacer />
      <ToolbarGroup>
        <ToolBarButton
          type="button"
          icon={redoIcon}
          aria-label="Archive selected"
          title="Archive selected"
        />
        <ToolBarButton
          type="button"
          icon={redoIcon}
          aria-label="Archive current folder"
          title="Archive current folder"
        />
      </ToolbarGroup>
    </Toolbar>
  );

  const archiveToolbar = (
    <Toolbar>
      <ToolbarGroup>
        <ToolBarButton
          type="button"
          icon={undoIcon}
          aria-label="Transfer current folder to source"
          title="Transfer current folder to source"
        />
        <ToolBarButton
          type="button"
          icon={undoIcon}
          aria-label="Transfer selected to source"
          title="Transfer selected to source"
        />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ToolBarButton type="button" icon={undoIcon} aria-label="Undo" title="Undo" />
        <ToolBarButton type="button" icon={redoIcon} aria-label="Redo" title="Redo" disabled />
        <ToolBarButton type="button" icon={upIcon} aria-label="Go up" title="Go up" />
      </ToolbarGroup>
    </Toolbar>
  );

  return (
    <main className={`${style.mainDisplay} ${style.mainDisplayNoFolder}`}>
      {data.status === DataStatus.FOLDER_CLOSED && (
        <p className={style.mainText}>Please select a source folder and an archive folder</p>
      )}
      {data.status === DataStatus.DIFFING && data.message?.type === "progress" && (
        <>
          <PacmanLoader size={20} color="#a0a0a0" speedMultiplier={1.3} />
          <ProgressBar className={style.loadingBar} percentage={data.message.value || 0} />
          <p className={style.mainText}>{data.message.message}</p>
          <GenericButton className={style.cancelButton}>Cancel</GenericButton>
        </>
      )}
      {data.status === DataStatus.FOLDER_OPENED && (
        <Group>
          <Panel defaultSize="50%" minSize="600px">
            <FolderDisplay toolbar={sourceToolbar} node={data.currentSource} folder="source" />
          </Panel>
          <Separator className={style.separator} />
          <Panel minSize="600px">
            <FolderDisplay toolbar={archiveToolbar} node={data.currentArchive} folder="archive" />
          </Panel>
        </Group>
      )}
    </main>
  );
}
