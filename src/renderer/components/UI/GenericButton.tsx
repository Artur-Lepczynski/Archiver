/* eslint-disable react/button-has-type */
/* eslint-disable react/require-default-props */
import { ButtonHTMLAttributes } from "react";
import style from "./GenericButton.module.css";

interface GenericButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export default function GenericButton({
  className,
  type,
  disabled,
  onClick,
  children,
}: GenericButtonProps) {
  return (
    <button
      className={`${className} ${style.button}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
