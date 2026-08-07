"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Two stacked 0-9 runs so a 9→0 wrap can keep rolling forward. */
const STRIP = Array.from({ length: 20 }, (_, i) => i % 10);

function Digit({ d }: { d: number }) {
  const [pos, setPos] = useState(d);
  const [instant, setInstant] = useState(false);
  const posRef = useRef(d);

  useEffect(() => {
    const cur = posRef.current;
    const delta = (d - (cur % 10) + 10) % 10;
    if (delta === 0) return;
    posRef.current = cur + delta;
    setPos(posRef.current);
  }, [d]);

  // After rolling into the second strip, snap back one strip without a
  // transition so the next roll always moves forward.
  const onEnd = () => {
    if (posRef.current >= 10) {
      posRef.current -= 10;
      setInstant(true);
      setPos(posRef.current);
      requestAnimationFrame(() => requestAnimationFrame(() => setInstant(false)));
    }
  };

  return (
    <span className="pk-digit">
      <span
        className="pk-digit-strip"
        style={{ transform: `translateY(${-pos}em)`, transition: instant ? "none" : undefined }}
        onTransitionEnd={onEnd}
      >
        {STRIP.map((n, i) => (
          <span key={i} className="pk-digit-cell">
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

/**
 * Rolling mechanical counter. Digits are keyed by place value from the
 * right so existing columns keep rolling when a new leading digit appears.
 */
export function Odometer({ value, className }: { value: number; className?: string }) {
  const digits = String(Math.max(0, Math.floor(value)))
    .split("")
    .map(Number);
  return (
    <span className={cn("pk-odometer", className)}>
      <span aria-hidden="true" className="inline-flex">
        {digits.map((d, i) => (
          <Digit key={digits.length - i} d={d} />
        ))}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
