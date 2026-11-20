// Parts 3 and 4: the learner types the working line by line and the tutor checks every line.
// The learner can always ask for a hint, and after the hints run out can ask to be shown the answer,
// so nobody ever hits a dead end.
"use client";

import { useEffect, useRef, useState } from "react";
import { answerValues, checkStep, fillBlanks } from "../lib/fractions";
import type { GenericLines, TryPart as TryPartData } from "../lib/lesson-types";
import { Keypad } from "./keypad";
import { MathLine } from "./math-line";
import { PartLayout } from "./part-layout";
import { TutorCaption, type Tone } from "./tutor-caption";
import { primaryButton } from "./ui";

type Props = {
  part: TryPartData;
  generic: GenericLines;
  active: boolean;
  voiceOn: boolean;
  nextLabel: string;
  onContinue: () => void;
};

type Phase = "answering" | "answered" | "finished";
type DoneLine = { text: string; shown: boolean };

export function TryPart({ part, generic, active, voiceOn, nextLabel, onContinue }: Props) {
  const steps = part.steps;
  const [stepIndex, setStepIndex] = useState(0);
  const [doneLines, setDoneLines] = useState<DoneLine[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [activeSlot, setActiveSlot] = useState("n");
  const [phase, setPhase] = useState<Phase>("answering");
  const [hintsShown, setHintsShown] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [feedback, setFeedback] = useState<{ tone: Tone; text: string }>({
    tone: "neutral",
    text: `${part.intro} ${steps[0].say}`,
  });
  const newestLine = useRef<HTMLDivElement>(null);

  const step = steps[stepIndex];
  const isFraction = step.input === "fraction";
  const isLastStep = stepIndex === steps.length - 1;
  const focus = phase === "finished" ? [] : step.focus ?? [];
  const slotNames: Record<string, string> = isFraction ? { n: "top number", d: "bottom number" } : { n: "answer" };
  const hintLabel = hintsShown < step.hints.length ? (hintsShown === 0 ? "Hint" : "Another hint") : "Show me";

  useEffect(() => {
    if (active) newestLine.current?.scrollIntoView?.({ block: "nearest" });
  }, [stepIndex, phase, active]);

  function typeDigit(digit: string) {
    if (phase !== "answering") return;
    setValues((current) => {
      const old = current[activeSlot] ?? "";
      if (old.length >= 3) return current;
      return { ...current, [activeSlot]: old === "0" ? digit : old + digit };
    });
  }

  function backspace() {
    if (phase !== "answering") return;
    setValues((current) => ({ ...current, [activeSlot]: (current[activeSlot] ?? "").slice(0, -1) }));
  }

  function swapSlot() {
    if (isFraction) setActiveSlot((slot) => (slot === "n" ? "d" : "n"));
  }

  function acceptStep(text: string, shown: boolean) {
    setDoneLines((lines) => [...lines, { text: fillBlanks(step.math, answerValues(step)), shown }]);
    setPhase("answered");
    setFeedback({ tone: shown ? "neutral" : "right", text });
  }

  function missStep(tone: Tone, text: string) {
    const count = wrongCount + 1;
    setWrongCount(count);
    let nudge = "";
    if (count >= 2) nudge = ` ${hintsShown < step.hints.length ? generic.nudgeHint : generic.lastHint}`;
    setFeedback({ tone, text: text + nudge });
  }

  function check() {
    if (phase !== "answering") return;
    const why = step.why ? ` ${step.why}` : "";
    const result = checkStep(step, values);
    switch (result.status) {
      case "empty":
        setFeedback({ tone: "neutral", text: generic.empty });
        return;
      case "zero":
        missStep("wrong", generic.zeroBottom);
        return;
      case "right":
        acceptStep(`${generic.right}${why}`, false);
        return;
      case "right-note":
        acceptStep(`${(step.multipleNote ?? "").replace("{n}", String(result.typed))}${why}`, false);
        return;
      case "equivalent":
        missStep("close", step.ifEquivalent ?? generic.equivalent);
        return;
      case "mistake":
        missStep("wrong", result.say);
        return;
      case "wrong":
        missStep("wrong", step.wrong ?? generic.wrong);
        return;
    }
  }

  // Hints come one at a time. When they run out, the same button shows the answer.
  function hint() {
    if (phase !== "answering") return;
    if (hintsShown < step.hints.length) {
      const text = step.hints[hintsShown];
      const next = hintsShown + 1;
      setHintsShown(next);
      setFeedback({ tone: "hint", text: next === step.hints.length ? `${text} ${generic.lastHint}` : text });
      return;
    }
    acceptStep(`${generic.reveal}${step.why ? ` ${step.why}` : ""}`, true);
  }

  function nextStep() {
    if (phase !== "answered") return;
    if (isLastStep) {
      setPhase("finished");
      setFeedback({ tone: "neutral", text: part.finish });
      return;
    }
    const nextIndex = stepIndex + 1;
    setStepIndex(nextIndex);
    setValues({});
    setActiveSlot("n");
    setHintsShown(0);
    setWrongCount(0);
    setPhase("answering");
    setFeedback({ tone: "neutral", text: steps[nextIndex].say });
  }

  function primaryAction() {
    if (phase === "answering") check();
    else if (phase === "answered") nextStep();
    else onContinue();
  }

  // On a laptop the learner can type with the keyboard as well as the number pad.
  useEffect(() => {
    if (!active) return;
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const onButton = (event.target as HTMLElement | null)?.tagName === "BUTTON";
      if (phase === "answering") {
        if (/^\d$/.test(event.key)) {
          event.preventDefault();
          typeDigit(event.key);
          return;
        }
        if (event.key === "Backspace") {
          event.preventDefault();
          backspace();
          return;
        }
        if (isFraction && event.key.startsWith("Arrow")) {
          event.preventDefault();
          swapSlot();
          return;
        }
      }
      if (event.key === "Enter" && !onButton) {
        event.preventDefault();
        primaryAction();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <PartLayout
      work={
        <div className="space-y-5">
          <p className="text-base font-semibold">
            {phase === "finished" ? "All done" : `Step ${stepIndex + 1} of ${steps.length}`}
          </p>
          <div className="rounded-2xl bg-black/25 px-5 py-4">
            <MathLine className="block text-4xl" focus={focus} math={part.problem} />
          </div>
          {doneLines.map((line, index) => (
            <div className="flex items-center gap-3" key={index} ref={index === doneLines.length - 1 ? newestLine : undefined}>
              <MathLine className="text-3xl" focus={focus} math={line.text} />
              <span className="text-base font-bold">
                {line.shown ? "shown" : <span aria-hidden="true">✓</span>}
                {!line.shown && <span className="sr-only">correct</span>}
              </span>
            </div>
          ))}
          {phase === "answering" && (
            <div className="rounded-2xl bg-white px-5 py-4 text-ink" ref={newestLine}>
              <MathLine
                activeSlot={activeSlot}
                className="block text-4xl"
                focus={focus}
                math={step.math}
                onPickSlot={setActiveSlot}
                slotNames={slotNames}
                values={values}
              />
            </div>
          )}
        </div>
      }
      dock={
        <>
          <TutorCaption speak={voiceOn && active} text={feedback.text} tone={feedback.tone} />
          {phase === "answering" && (
            <Keypad
              hintLabel={hintLabel}
              onBackspace={backspace}
              onCheck={check}
              onDigit={typeDigit}
              onHint={hint}
              onSwap={isFraction ? swapSlot : undefined}
            />
          )}
          {phase !== "answering" && (
            <div className="flex">
              <button className={primaryButton} onClick={primaryAction} type="button">
                {phase === "answered" ? (isLastStep ? "Finish" : "Next step") : nextLabel}
              </button>
            </div>
          )}
        </>
      }
    />
  );
}
