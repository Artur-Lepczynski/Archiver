import style from "./ToolbarGroup.module.css";

interface ToolbarGroupProps {
  children: React.ReactNode;
}

export default function ToolbarGroup({ children }: ToolbarGroupProps) {
  return <div className={style.toolbarGroup}>{children}</div>;
}
