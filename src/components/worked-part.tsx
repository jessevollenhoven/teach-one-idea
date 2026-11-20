// Part 2: a worked example. The working appears one line at a time. The newest line sits in a white
// block with the highlighter on it, and the tutor explains it.
"use client";

import { useEffect, useRef, useState } from "react";
import type { WorkedPart as WorkedPartData } from "../lib/lesson-types";
import { FractionBars } from "./fraction-bars";
import { MathLine } from "./math-line";
import { PartLayout } from "./part-layout";
import { TutorCaption } from "./tutor-caption";
import { primaryButton, secondaryButton } from "./ui";

type Props = {
  part: WorkedPartData;
  active: boolean;
  voiceOn: boolean;
  nextLabel: string;
  onContinue: () => void;
};

export function WorkedPart({ part, active, voiceOn, nextLabel, onContinue }: Props) {
  const [shown, setShown] = useState(1);
  const lastLine = useRef<HTMLDivElement>(null);
  const current = part.lines[shown - 1];
  const isLast = shown === part.lines.length;

  // Keeps the newest line in view on a small screen.
  useEffect(() => {
    if (active) lastLine.current?.scrollIntoView?.({ block: "nearest" });
  }, [shown, active]);

  return (
    <PartLayout
      work={
        <div className="space-y-5">
          <p className="text-base font-semibold">
            Line {shown} of {part.lines.length}
          </p>
          {part.lines.slice(0, shown).map((line, index) => {
            const isNewest = index === shown - 1;
            return (
              <div key={index} ref={isNewest ? lastLine : undefined}>
                {isNewest ? (
                  <div className="rounded-2xl bg-white px-5 py-4 text-ink">
                    <MathLine className="block text-4xl" focus={line.focus} math={line.math} />
                  </div>
                ) : (
                  <MathLine className="block text-3xl" math={line.math} />
                )}
                {line.visual && (
                  <div className="mt-4">
                    <FractionBars visual={line.visual} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      }
      dock={
        <>
          <TutorCaption speak={voiceOn && active} text={current.say} tone="neutral" />
          <div className="flex gap-2">
            <button className={secondaryButton} disabled={shown === 1} onClick={() => setShown(shown - 1)} type="button">
              Back
            </button>
            <button className={primaryButton} onClick={isLast ? onContinue : () => setShown(shown + 1)} type="button">
              {isLast ? nextLabel : "Next line"}
            </button>
          </div>
        </>
      }
    />
  );
}
