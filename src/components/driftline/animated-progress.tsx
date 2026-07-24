"use client";

import { useVisible } from "./use-visible";

interface AnimatedProgressProps {
  value: number;
  label: string;
  className?: string;
  decorative?: boolean;
}

export function AnimatedProgress({ value, label, className, decorative = false }: AnimatedProgressProps) {
  const { ref, visible } = useVisible<HTMLSpanElement>();

  return (
    <span
      ref={ref}
      className={`motion-progress${className ? ` ${className}` : ""}`}
      data-visible={visible ? "true" : "false"}
      style={{ "--progress-value": `${Math.max(0, Math.min(100, value))}%` } as React.CSSProperties}
      {...(decorative
        ? { "aria-hidden": true }
        : { role: "progressbar", "aria-label": label, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": value })}
    >
      <i />
    </span>
  );
}
