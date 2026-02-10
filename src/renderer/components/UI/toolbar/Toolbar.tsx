import style from "./Toolbar.module.css";

interface ToolbarProps {
  children: React.ReactNode;
}

export default function Toolbar({ children }: ToolbarProps) {
  return <header className={style.toolbar}>{children}</header>;
}
