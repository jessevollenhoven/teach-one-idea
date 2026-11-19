// Part 1: short blocks of explanation. The learner moves forward and back at their own pace.
"use client";

import { useState } from "react";
import type { ExplainPart as ExplainPartData } from "../lib/lesson-types";
import { FractionBars } from "./fraction-bars";
import { MathLine } from "./math-line";
import { PartLayout } from "./part-layout";
import { TutorCaption } from "./tutor-caption";
import { primaryButton, secondaryButton } from "./ui";

type Props = {
  part: ExplainPartData;
  active: boolean;
  voiceOn: boolean;
  nextLabel: string;
  onContinue: () => void;
};

export function ExplainPart({ part, active, voiceOn, nextLabel, onContinue }: Props) {
  const [index, setIndex] = useState(0);
  const block = part.blocks[index];
  const isLast = index === part.blocks.length - 1;

  return (
    <PartLayout
      work={
        <div className="space-y-6">
          <p className="text-sm font-medium text-muted">
            {index + 1} of {part.blocks.length}
          </p>
          <h2 className="text-3xl font-semibold leading-tight">{block.title}</h2>
          {block.math && <MathLine className="block text-4xl" focus={block.focus} math={block.math} />}
          {block.visual && <FractionBars key={index} visual={block.visual} />}
          {block.list && (
            <ol className="space-y-3 text-lg">
              {block.list.map((item, i) => (
                <li className="flex gap-3" key={item}>
                  <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{item}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      }
      dock={
        <>
          <TutorCaption speak={voiceOn && active} text={block.say} tone="neutral" />
          <div className="flex gap-2">
            <button className={secondaryButton} disabled={index === 0} onClick={() => setIndex(index - 1)} type="button">
              Back
            </button>
            <button className={primaryButton} onClick={isLast ? onContinue : () => setIndex(index + 1)} type="button">
              {isLast ? nextLabel : "Next"}
            </button>
          </div>
        </>
      }
    />
  );
}
