import style from "./ProgressBar.module.css";

interface ProgressBarProps {
  percentage: number;
  className?: string;
}

export default function ProgressBar({ className, percentage }: ProgressBarProps) {
  return (
    <div className={`${style.wrapper} ${className}`}>
      <p className={style.progressText}>{percentage + "%"}</p>
      <div className={style.bar} style={{ width: percentage + "%" }}></div>
    </div>
  );
}
