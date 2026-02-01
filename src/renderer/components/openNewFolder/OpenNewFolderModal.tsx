/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from "react";
import Separator from "../UI/Separator";
import style from "./OpenNewFolderModal.module.css";
import GenericButton from "../UI/GenericButton";

export default function OpenNewFolderModal() {
  const [archiveURL, setArchiveURL] = useState("");
  const [copyURL, setCopyURL] = useState("");
  const [foldersValid, setFoldersValid] = useState(false);

  useEffect(() => {
    archiveURL && copyURL && archiveURL !== copyURL
      ? setFoldersValid(true)
      : setFoldersValid(false);
  }, [archiveURL, copyURL]);

  function handleClose() {
    window.electron.closeNewFolderModal();
  }

  async function handleArchiveSelect() {
    const archivePath = await window.electron.openNewFolderModalArchiveSelect();
    if (!archivePath) return;
    setArchiveURL(archivePath);
  }

  async function handleCopySelect() {
    const copyPath = await window.electron.openNewFolderModalCopySelect();
    if (!copyPath) return;
    setCopyURL(copyPath);
  }

  return (
    <div className={style.modal}>
      <h2 className={style.title}>Select an archive and a copy folder</h2>
      <Separator fancy className={style.separator} />
      <div className={style.folderInputsWrapper}>
        <div className={style.folderInputWrapper}>
          <label className={style.label} htmlFor="archive-input">
            Archive
          </label>
          <input
            className={style.input}
            readOnly
            id="archive-input"
            type="text"
            value={archiveURL}
          />
          <GenericButton type="button" onClick={handleArchiveSelect}>
            Select folder
          </GenericButton>
        </div>
        <div className={style.folderInputWrapper}>
          <label className={style.label} htmlFor="copy-input">
            Copy
          </label>
          <input
            className={style.input}
            readOnly
            id="copy-input"
            type="text"
            value={copyURL}
          />
          <GenericButton type="button" onClick={handleCopySelect}>
            Select folder
          </GenericButton>
        </div>
      </div>
      <div className={style.controlsWrapper}>
        <GenericButton
          className={style.control}
          type="button"
          onClick={handleClose}
        >
          Cancel
        </GenericButton>
        <GenericButton
          className={style.control}
          type="button"
          disabled={!foldersValid}
        >
          Ok
        </GenericButton>
      </div>
    </div>
  );
}
