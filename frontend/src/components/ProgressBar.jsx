import React from "react";

export default function ProgressBar({ value, total }) {
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0;
  return (
    <div className="w-full">
      <div
        className="w-full h-1.5 rounded-full bg-border/60 overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={value}
        data-testid="rosary-progress-bar"
      >
        <div
          className="h-full bg-primary transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground tabular-nums">
        Langkah {value} dari {total}
      </p>
    </div>
  );
}
