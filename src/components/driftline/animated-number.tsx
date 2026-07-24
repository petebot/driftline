"use client";

import { useEffect, useRef, useState } from "react";
import { useVisible } from "./use-visible";

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  minimumIntegerDigits?: number;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  minimumIntegerDigits = 1,
  duration = 620,
  className,
}: AnimatedNumberProps) {
  const { ref, visible } = useVisible<HTMLSpanElement>();
  const [displayed, setDisplayed] = useState(0);
  const displayedRef = useRef(0);

  useEffect(() => {
    if (!visible) return;

    let frame = 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      frame = requestAnimationFrame(() => {
        displayedRef.current = value;
        setDisplayed(value);
      });
      return () => cancelAnimationFrame(frame);
    }

    const startedAt = performance.now();
    const startingValue = displayedRef.current;
    const distance = value - startingValue;
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const nextValue = Math.round(startingValue + distance * eased);
      displayedRef.current = nextValue;
      setDisplayed(nextValue);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, value, visible]);

  const finalLabel = `${prefix}${String(value).padStart(minimumIntegerDigits, "0")}${suffix}`;
  const visualValue = `${prefix}${String(displayed).padStart(minimumIntegerDigits, "0")}${suffix}`;

  return (
    <span ref={ref} className={className} aria-label={finalLabel} data-motion-number>
      <span aria-hidden="true">{visualValue}</span>
    </span>
  );
}
