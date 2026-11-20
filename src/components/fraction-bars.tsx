// Fraction bars. With a "sliceTo" value, a button cuts every bar into smaller equal pieces,
// so the learner can see why a common denominator works.
// The bars sit on the part's colour field, so they use white, yellow and navy, which show up on all of them.
"use client";

import { useState } from "react";
import type { BarsVisual } from "../lib/lesson-types";
import { secondaryButton } from "./ui";
import { MathLine } from "./math-line";

// Full class names are written out so Tailwind can find them.
const barStyles = {
  a: { fill: "bg-white", edge: "border-l-2 border-ink", thin: "border-l-2 border-ink/30" },
  b: { fill: "bg-mark", edge: "border-l-2 border-ink", thin: "border-l-2 border-ink/30" },
  sum: { fill: "bg-ink", edge: "border-l-2 border-white", thin: "border-l-2 border-white/40" },
} as const;

export function FractionBars({ visual }: { visual: BarsVisual }) {
  const [sliced, setSliced] = useState(Boolean(visual.sliced));

  return (
    <div className="space-y-5">
      {visual.rows.map((row) => {
        const cells = visual.sliceTo ?? row.parts;
        const perPiece = cells / row.parts;
        const filledCells = row.filled * perPiece;
        const style = barStyles[row.color];
        const label =
          sliced && visual.sliceTo && perPiece > 1
            ? `${row.label} = ${filledCells}/${cells}`
            : row.label;

        return (
          <div key={row.label}>
            <MathLine className="text-3xl" math={label} />
            <div
              aria-label={`${row.label}: ${row.filled} of ${row.parts} equal pieces filled in`}
              className="mt-2 flex overflow-hidden rounded-xl border-[3px] border-white bg-black/25"
              role="img"
            >
              {Array.from({ length: cells }, (_, index) => {
                const isMainEdge = index % perPiece === 0;
                const edge = index === 0
                  ? "border-l-0"
                  : isMainEdge
                    ? style.edge
                    : sliced
                      ? style.thin
                      : "border-l-2 border-transparent";
                return (
                  <span
                    className={`h-12 flex-1 motion-safe:transition-colors motion-safe:duration-500 ${edge} ${
                      index < filledCells ? style.fill : "bg-transparent"
                    }`}
                    key={index}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {visual.sliceTo && (
        <button
          aria-pressed={sliced}
          className={`${secondaryButton} aria-pressed:bg-mark`}
          onClick={() => setSliced((value) => !value)}
          type="button"
        >
          {sliced ? visual.unsliceLabel ?? "Put them back" : visual.sliceLabel ?? "Cut into smaller pieces"}
        </button>
      )}
    </div>
  );
}
