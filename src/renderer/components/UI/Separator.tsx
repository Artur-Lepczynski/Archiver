/* eslint-disable react/require-default-props */
import style from "./Separator.module.css";

interface SeparatorProps {
  fancy?: boolean;
  orientation: "horizontal" | "vertical";
  className?: string;
}

export default function Separator({ fancy = false, className = "", orientation }: SeparatorProps) {
  if (orientation === "horizontal") {
    return (
      <hr className={`${style.horizontalSeparator} ${className} ${fancy ? style.fancy : ""}`} />
    );
  } else {
    return <div className={`${style.verticalSeparator} ${className}`}></div>;
  }
}
