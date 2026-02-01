/* eslint-disable react/require-default-props */
import style from "./Separator.module.css";

interface SeparatorProps {
  fancy?: boolean;
  className?: string;
}

export default function Separator({
  fancy = false,
  className = "",
}: SeparatorProps) {
  return (
    <hr
      className={`${style.separator} ${className} ${fancy ? style.fancy : ""}`}
    />
  );
}
