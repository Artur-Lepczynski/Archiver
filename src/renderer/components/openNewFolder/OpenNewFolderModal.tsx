/* eslint-disable react/jsx-no-bind */
/* eslint-disable default-case */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useMemo, useState } from "react";
import Separator from "../UI/Separator";
import style from "./OpenNewFolderModal.module.css";
import GenericButton from "../UI/GenericButton";

type FolderValidationError =
  | "MISSING_PATH"
  | "SAME_PATH"
  | "NESTED_PATH"
  | "DIFFERENT_FOLDER_NAME";

type folderValidationResult =
  | { valid: true }
  | { valid: false; reason: FolderValidationError };

export default function OpenNewFolderModal() {
  const [archiveURL, setArchiveURL] = useState("");
  const [copyURL, setCopyURL] = useState("");

  function validateFolders(
    archiveURL: string,
    copyURL: string,
  ): folderValidationResult {
    const normalizedArchiveURL = archiveURL.replace(/\\/g, "/");
    const normalizedCopyURL = copyURL.replace(/\\/g, "/");

    if (!normalizedArchiveURL || !normalizedCopyURL) {
      return { valid: false, reason: "MISSING_PATH" };
    }

    if (normalizedArchiveURL === normalizedCopyURL) {
      return { valid: false, reason: "SAME_PATH" };
    }

    if (
      normalizedArchiveURL.startsWith(`${normalizedCopyURL}/`) ||
      normalizedCopyURL.startsWith(`${normalizedArchiveURL}/`)
    ) {
      return { valid: false, reason: "NESTED_PATH" };
    }

    const archiveLastFolder = normalizedArchiveURL.split("/").pop() || "";
    const copyLastFolder = normalizedCopyURL.split("/").pop() || "";
    if (archiveLastFolder !== copyLastFolder) {
      return { valid: false, reason: "DIFFERENT_FOLDER_NAME" };
    }
    return { valid: true };
  }

  const foldersValid = useMemo(() => {
    return validateFolders(archiveURL, copyURL);
  }, [archiveURL, copyURL]);

  const errorText = useMemo(() => {
    if (foldersValid.valid) return "";

    switch (foldersValid.reason) {
      case "MISSING_PATH":
        return "";
      case "SAME_PATH":
        return "Please choose two different folders";
      case "NESTED_PATH":
        return "One of the folders is a subfolder of the other";
      case "DIFFERENT_FOLDER_NAME":
        return "Please choose the same logical folder - same folder name, different path";
    }
  }, [foldersValid]);

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
        <span className={style.errorText}>{!foldersValid || errorText}</span>
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
          disabled={!foldersValid.valid}
        >
          Ok
        </GenericButton>
      </div>
    </div>
  );
}
