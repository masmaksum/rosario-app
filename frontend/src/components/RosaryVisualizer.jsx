import React from "react";

/**
 * Visualizes 5 decades x 10 hail-mary beads.
 * - Completed beads (in finished decades) are filled with primary color.
 * - The active bead glows gold.
 * - Decade separator beads (larger) marked between groups.
 *
 * Props:
 *   decadeIndex: 0..4 | null (null when not inside a decade)
 *   hailMaryIndex: 1..10 | null (null when on Bapa Kami / Kemuliaan / Fatima screens of a decade)
 *   completedDecades: number (0..5) - decades fully prayed
 */
export default function RosaryVisualizer({
  decadeIndex,
  hailMaryIndex,
  completedDecades = 0,
  mysteryLabel,
}) {
  const decades = [0, 1, 2, 3, 4];

  return (
    <div
      className="w-full flex flex-col items-center gap-4 select-none"
      data-testid="rosary-visualizer"
      aria-label={
        decadeIndex !== null && hailMaryIndex
          ? `Manik Salam Maria ${hailMaryIndex} dari 10, Peristiwa ke-${decadeIndex + 1}`
          : "Visualisasi manik Rosario"
      }
    >
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-full">
        {decades.map((d) => {
          const isCurrent = decadeIndex === d;
          const isCompleted = d < completedDecades;
          return (
            <React.Fragment key={d}>
              {/* Decade marker bead (Bapa Kami) */}
              <div
                className={`w-3.5 h-3.5 rounded-full border transition-all duration-500 ${
                  isCompleted
                    ? "bg-primary border-primary"
                    : isCurrent
                      ? "bg-accent border-accent shadow-[0_0_10px_rgba(212,175,55,0.55)]"
                      : "bg-transparent border-border"
                }`}
                aria-hidden="true"
              />
              {/* 10 Hail Mary beads */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 10 }).map((_, i) => {
                  const beadNum = i + 1;
                  let cls =
                    "w-2.5 h-2.5 rounded-full transition-all duration-500 bg-border/60";
                  if (isCompleted) {
                    cls = "w-2.5 h-2.5 rounded-full bg-primary/80";
                  } else if (isCurrent && hailMaryIndex) {
                    if (beadNum < hailMaryIndex) {
                      cls = "w-2.5 h-2.5 rounded-full bg-primary/80";
                    } else if (beadNum === hailMaryIndex) {
                      cls =
                        "w-3.5 h-3.5 rounded-full bg-accent bead-active";
                    }
                  }
                  return <div key={i} className={cls} aria-hidden="true" />;
                })}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      {decadeIndex !== null && (
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {mysteryLabel || `Peristiwa ${decadeIndex + 1} dari 5`}
        </p>
      )}
    </div>
  );
}
