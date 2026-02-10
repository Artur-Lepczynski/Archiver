import style from "./Infobar.module.css";

interface InfobarProps {
  children: React.ReactNode;
}

export default function Infobar({ children }: InfobarProps) {
  return <footer className={style.infobar}>{children}</footer>;
}
