// The tutor. It has no face: it is a caption that says what to do next, with a label and symbol
// (never colour alone) showing whether it is helping, praising or hinting. It can also read aloud.
"use client";

import { useEffect } from "react";
import { spoken } from "../lib/fractions";

export type Tone = "neutral" | "right" | "wrong" | "close" | "hint";

const tones: Record<Tone, { label: string; symbol: string; box: string; badge: string }> = {
  neutral: { label: "Tutor", symbol: "•", box: "border-field bg-paper", badge: "bg-field text-on-field" },
  right: { label: "Correct", symbol: "✓", box: "border-ok bg-ok-soft", badge: "bg-ok text-white" },
  wrong: { label: "Not yet", symbol: "✗", box: "border-no bg-no-soft", badge: "bg-no text-white" },
  close: { label: "Close", symbol: "!", box: "border-ink bg-[#fff3c4]", badge: "bg-ink text-white" },
  hint: { label: "Hint", symbol: "?", box: "border-field bg-paper", badge: "bg-field text-on-field" },
};

type TutorCaptionProps = {
  text: string;
  tone: Tone;
  speak: boolean;
};

export function TutorCaption({ text, tone, speak }: TutorCaptionProps) {
  // Reads the caption aloud with the browser's own voice, only when the learner has switched voice on.
  useEffect(() => {
    if (!speak || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(spoken(text));
    utterance.lang = "en";
    utterance.rate = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return () => window.speechSynthesis.cancel();
  }, [text, speak]);

  const style = tones[tone];
  return (
    <div
      aria-live="polite"
      className={`max-h-[34dvh] overflow-y-auto rounded-xl border-l-8 p-3 lg:max-h-none ${style.box}`}
      role="status"
    >
      <p className="flex items-center gap-2 text-sm font-semibold text-ink">
        <span aria-hidden="true" className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-sm ${style.badge}`}>
          {style.symbol}
        </span>
        {style.label}
      </p>
      <p className="mt-1 text-lg leading-snug text-ink">{text}</p>
    </div>
  );
}
