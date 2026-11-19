// Part 2: a worked example. The working appears one line at a time, with the tutor explaining
// each line and the highlighter pointing at the part being talked about.
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
        <div className="space-y-6">
          <p className="text-sm font-medium text-muted">
            Line {shown} of {part.lines.length}
          </p>
          {part.lines.slice(0, shown).map((line, index) => (
            <div key={index} ref={index === shown - 1 ? lastLine : undefined}>
              <MathLine
                className="block text-4xl"
                focus={index === shown - 1 ? line.focus : []}
                math={line.math}
              />
              {line.visual && (
                <div className="mt-4">
                  <FractionBars visual={line.visual} />
                </div>
              )}
            </div>
          ))}
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
