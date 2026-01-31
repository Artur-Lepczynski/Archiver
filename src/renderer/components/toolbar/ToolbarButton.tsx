/* eslint-disable react/button-has-type */

import React from "react";
import style from "./ToolbarButton.module.css";

interface ToolBarButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  "aria-label": string;
}

export default function ToolBarButton({
  icon,
  "aria-label": ariaLabel,
  type,
  title,
  onClick,
  disabled,
}: ToolBarButtonProps) {
  return (
    <button
      className={style.button}
      type={type}
      aria-label={ariaLabel}
      title={title}
      onClick={onClick}
      disabled={disabled}
    >
      <img src={icon} alt={`${ariaLabel} button`} height={18} width={18} />
    </button>
  );
}
