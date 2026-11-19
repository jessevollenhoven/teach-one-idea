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
    <div className="min-h-dvh bg-paper">
      <header className="border-b-2 border-ink bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2">
          <h1 className="text-lg font-semibold">{lesson.title}</h1>
          <button
            aria-pressed={voiceOn}
            className="inline-flex min-h-11 items-center rounded-full border-2 border-ink px-4 text-sm font-semibold text-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink aria-pressed:bg-ink aria-pressed:text-white"
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
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border-2 text-base font-semibold focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                index === current
                  ? "border-blue bg-blue text-white"
                  : index <= reached
                    ? "border-ink bg-white text-ink hover:bg-blue-soft"
                    : "border-line bg-paper text-muted"
              } disabled:cursor-not-allowed`}
              disabled={index > reached}
              key={index}
              onClick={() => setCurrent(index)}
              type="button"
            >
              {index + 1}
            </button>
          ))}
          <p className="ml-2 text-base font-medium">{lesson.parts[current].title}</p>
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
