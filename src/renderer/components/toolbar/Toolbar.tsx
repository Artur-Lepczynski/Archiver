import style from "./Toolbar.module.css";
import openIcon from "../../assets/icons/open-folder.svg";
import closeIcon from "../../assets/icons/close-folder.svg";
import undoIcon from "../../assets/icons/arrow-left.svg";
import redoIcon from "../../assets/icons/arrow-right.svg";
import upIcon from "../../assets/icons/arrow-up.svg";
import infoIcon from "../../assets/icons/info.svg";
import settingsIcon from "../../assets/icons/gear.svg";
import ToolBarButton from "./ToolbarButton";
import ToolbarSeparator from "./ToolbarSeparator";

export default function Toolbar() {
  return (
    <header className={style.toolbar}>
      <div className={style.toolbarGroup}>
        <ToolBarButton
          type="button"
          icon={openIcon}
          aria-label="Open new folder"
          title="Open new folder"
        />
        <ToolBarButton
          type="button"
          icon={closeIcon}
          aria-label="Close folder"
          title="Close folder"
        />
      </div>
      <ToolbarSeparator />
      <div className={style.toolbarGroup}>
        <ToolBarButton
          type="button"
          icon={undoIcon}
          aria-label="Undo"
          title="Undo"
        />
        <ToolBarButton
          type="button"
          icon={redoIcon}
          aria-label="Redo"
          title="Redo"
          disabled
        />
        <ToolBarButton
          type="button"
          icon={upIcon}
          aria-label="Go up"
          title="Go up"
        />
      </div>
      <div className={style.spacer} />
      <div className={style.toolbarGroup}>
        <ToolBarButton
          type="button"
          icon={infoIcon}
          aria-label="About"
          title="About"
        />
        <ToolBarButton
          type="button"
          icon={settingsIcon}
          aria-label="Settings"
          title="Settings"
        />
      </div>
    </header>
  );
}
