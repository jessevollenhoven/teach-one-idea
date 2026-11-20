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
          <p className="text-base font-semibold">
            {index + 1} of {part.blocks.length}
          </p>
          <h2 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">{block.title}</h2>
          {block.math && (
            <div className="rounded-2xl bg-white px-5 py-4 text-ink">
              <MathLine className="block text-4xl" focus={block.focus} math={block.math} />
            </div>
          )}
          {block.visual && <FractionBars key={index} visual={block.visual} />}
          {block.list && (
            <ol className="space-y-4 text-xl font-medium">
              {block.list.map((item, i) => (
                <li className="flex gap-4" key={item}>
                  <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white font-bold text-field">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 leading-snug">{item}</span>
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
