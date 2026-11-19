// Fraction bars. With a "sliceTo" value, a button cuts every bar into smaller equal pieces,
// so the learner can see why a common denominator works.
"use client";

import { useState } from "react";
import type { BarsVisual } from "../lib/lesson-types";
import { secondaryButton } from "./ui";
import { MathLine } from "./math-line";

const filledColors = { a: "bg-blue", b: "bg-berry", sum: "bg-ok" } as const;

export function FractionBars({ visual }: { visual: BarsVisual }) {
  const [sliced, setSliced] = useState(Boolean(visual.sliced));

  return (
    <div className="space-y-5">
      {visual.rows.map((row) => {
        const cells = visual.sliceTo ?? row.parts;
        const perPiece = cells / row.parts;
        const filledCells = row.filled * perPiece;
        const label =
          sliced && visual.sliceTo && perPiece > 1
            ? `${row.label} = ${filledCells}/${cells}`
            : row.label;

        return (
          <div key={row.label}>
            <MathLine className="text-2xl" math={label} />
            <div
              aria-label={`${row.label}: ${row.filled} of ${row.parts} equal pieces filled in`}
              className="mt-2 flex overflow-hidden rounded-md border-2 border-ink bg-white"
              role="img"
            >
              {Array.from({ length: cells }, (_, index) => {
                const isMainEdge = index % perPiece === 0;
                const edge = index === 0
                  ? "border-l-0"
                  : isMainEdge
                    ? "border-l-2 border-ink"
                    : sliced
                      ? "border-l-2 border-ink/25"
                      : "border-l-2 border-transparent";
                return (
                  <span
                    className={`h-11 flex-1 motion-safe:transition-colors motion-safe:duration-500 ${edge} ${
                      index < filledCells ? filledColors[row.color] : "bg-white"
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
          className={secondaryButton}
          onClick={() => setSliced((value) => !value)}
          type="button"
        >
          {sliced ? visual.unsliceLabel ?? "Put them back" : visual.sliceLabel ?? "Cut into smaller pieces"}
        </button>
      )}
    </div>
  );
}
