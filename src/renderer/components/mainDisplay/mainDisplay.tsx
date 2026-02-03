import style from "./mainDisplay.module.css";

export default function MainDisplay() {
  return (
    <main className={`${style.mainDisplay} ${style.mainDisplayNoFolder}`}>
      <p>Please select a folder</p>
    </main>
  );
}
