import openIcon from "../../../assets/icons/open-folder.svg";
import closeIcon from "../../../assets/icons/close-folder.svg";
import undoIcon from "../../../assets/icons/arrow-left.svg";
import redoIcon from "../../../assets/icons/arrow-right.svg";
import upIcon from "../../../assets/icons/arrow-up.svg";
import infoIcon from "../../../assets/icons/info.svg";
import settingsIcon from "../../../assets/icons/gear.svg";
import Toolbar from "../../UI/toolbar/Toolbar";
import ToolbarGroup from "../../UI/toolbar/ToolbarGroup";
import ToolBarButton from "../../UI/toolbar/ToolbarButton";
import ToolbarSeparator from "../../UI/toolbar/ToolbarSeparator";
import ToolbarSpacer from "../../UI/toolbar/ToolbarSpacer";


interface MainToolbarProps {
  onReset: () => void;
}

export default function MainToolbar({ onReset: handleReset }: MainToolbarProps) {
  async function openNewFolderModal() {
    await window.electron.openNewFolderModal();
  }

  async function openAboutModal() {
    await window.electron.openAboutModal();
  }

  function handleCloseFolder() {
    handleReset();
  }

  return (
    <Toolbar>
      <ToolbarGroup>
        <ToolBarButton
          type="button"
          icon={openIcon}
          aria-label="Open new folder"
          title="Open new folder"
          onClick={openNewFolderModal}
        />
        <ToolBarButton
          type="button"
          icon={closeIcon}
          aria-label="Close folder"
          title="Close folder"
          onClick={handleCloseFolder}
        />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ToolBarButton type="button" icon={undoIcon} aria-label="Undo" title="Undo" />
        <ToolBarButton type="button" icon={redoIcon} aria-label="Redo" title="Redo" disabled />
        <ToolBarButton type="button" icon={upIcon} aria-label="Go up" title="Go up" />
      </ToolbarGroup>
      <ToolbarSpacer />
      <ToolbarGroup>
        <ToolBarButton
          type="button"
          icon={infoIcon}
          aria-label="About"
          title="About"
          onClick={openAboutModal}
        />
        <ToolBarButton type="button" icon={settingsIcon} aria-label="Settings" title="Settings" />
      </ToolbarGroup>
    </Toolbar>
  );
}
