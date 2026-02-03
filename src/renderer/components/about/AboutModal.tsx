import { useLayoutEffect, useState } from "react";
import style from "./AboutModal.module.css";
import appIcon from "../../assets/icons/256x256.png";
import Separator from "../UI/Separator";
import GenericButton from "../UI/GenericButton";

export default function AboutModal() {
  const [version, setVersion] = useState("");
  const licenseText = `This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

     This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

     You should have received a copy of the GNU General Public License along with this program.  If not, see <https://www.gnu.org/licenses/>.`;

  useLayoutEffect(() => {
    async function getVer() {
      const version = await window.electron.getVersion();
      setVersion(version);
    }
    getVer();
  }, []);

  function handleClose() {
    window.electron.closeAboutModal();
  }

  return (
    <div className={style.modal}>
      <img className={style.icon} src={appIcon} alt="app icon" width={200} height={200} />
      <h2 className={style.name}>
        Archiver <span className={style.version}>v{version}</span>
      </h2>
      <Separator className={style.separator} fancy />
      <div className={style.licenseWrapper}>
        <p className={style.licenseTitle}>GNU general public license</p>
        <p className={style.licenseText}>{licenseText}</p>
      </div>
      <Separator className={style.separator} fancy />
      <p className={style.credits}>Made by 👱🏻‍♂️ on 🌍</p>
      <GenericButton onClick={handleClose} className={style.button} type="button">
        Alright!
      </GenericButton>
    </div>
  );
}
