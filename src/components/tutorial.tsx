// The whole tutorial: four parts in a fixed order. The learner can go back to any part they have
// reached, but the "try" parts can only be unlocked by working through the part before.
"use client";

import { useEffect, useState } from "react";
import type { Lesson } from "../lib/lesson-types";
import { ExplainPart } from "./explain-part";
import { TryPart } from "./try-part";
import { WorkedPart } from "./worked-part";

export function Tutorial({ lesson }: { lesson: Lesson }) {
  const [current, setCurrent] = useState(0);
  const [reached, setReached] = useState(0);
  const [voiceOn, setVoiceOn] = useState(false);
  const [round, setRound] = useState(0);

  useEffect(() => {
    window.scrollTo?.({ top: 0 });
  }, [current]);

  function restart() {
    setRound((value) => value + 1);
    setCurrent(0);
    setReached(0);
  }

  function goToNext(index: number) {
    if (index + 1 >= lesson.parts.length) {
      restart();
      return;
    }
    setReached((value) => Math.max(value, index + 1));
    setCurrent(index + 1);
  }

  return (
    // The whole page takes the colour of the part the learner is in, and fades to the next colour as they move on.
    <div
      className="min-h-dvh bg-field text-on-field motion-safe:transition-colors motion-safe:duration-500"
      data-part={current}
    >
      <header>
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2">
          <h1 className="text-xl font-extrabold tracking-tight">{lesson.title}</h1>
          <button
            aria-pressed={voiceOn}
            className="inline-flex min-h-11 items-center rounded-full border-2 border-on-field px-4 text-sm font-bold focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-mark aria-pressed:bg-on-field aria-pressed:text-field"
            onClick={() => setVoiceOn((value) => !value)}
            type="button"
          >
            {voiceOn ? "Voice on" : "Voice off"}
          </button>
        </div>
        <nav aria-label="Parts of the lesson" className="mx-auto flex max-w-5xl items-center gap-2 px-4 pb-2">
          {lesson.parts.map((part, index) => (
            <button
              aria-current={index === current ? "step" : undefined}
              aria-label={`Part ${index + 1}: ${part.title}${index > reached ? ", locked" : ""}`}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border-2 text-base font-bold focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-mark ${
                index === current
                  ? "border-on-field bg-on-field text-field"
                  : index <= reached
                    ? "border-on-field text-on-field hover:bg-black/20"
                    : "border-dashed border-on-field/60 text-on-field/80"
              } disabled:cursor-not-allowed`}
              disabled={index > reached}
              key={index}
              onClick={() => setCurrent(index)}
              type="button"
            >
              {index + 1}
            </button>
          ))}
          <p className="ml-2 text-lg font-bold">{lesson.parts[current].title}</p>
        </nav>
      </header>

      <main>
        {lesson.parts.map((part, index) => {
          const isLast = index === lesson.parts.length - 1;
          const nextLabel = isLast ? "Start again" : `Next: ${lesson.parts[index + 1].title}`;
          const shared = {
            active: index === current,
            voiceOn,
            nextLabel,
            onContinue: () => goToNext(index),
          };
          return (
            <section aria-label={part.title} hidden={index !== current} key={`${round}-${index}`}>
              {part.kind === "explain" && <ExplainPart part={part} {...shared} />}
              {part.kind === "worked" && <WorkedPart part={part} {...shared} />}
              {(part.kind === "guided" || part.kind === "solo") && (
                <TryPart generic={lesson.generic} part={part} {...shared} />
              )}
            </section>
          );
        })}
      </main>
    </div>
  );
}
