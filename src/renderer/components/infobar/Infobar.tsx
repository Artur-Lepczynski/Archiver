import style from "./Infobar.module.css";

export default function Infobar() {
  return <footer className={style.infobar}>
    <p className={style.text}>No folder selected</p>
  </footer>;
}
