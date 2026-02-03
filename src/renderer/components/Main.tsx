import Infobar from "./infobar/Infobar";
import style from "./Main.module.css";
import MainDisplay from "./mainDisplay/mainDisplay";
import Toolbar from "./toolbar/Toolbar";

export default function Main() {
  return (
    <div className={style.main}>
      <Toolbar />
      <MainDisplay />
      <Infobar />
    </div>
  );
}
