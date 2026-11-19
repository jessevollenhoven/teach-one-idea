// Checks a learner's typed answer against what a step expects, and helps turn maths into words.
import type { TryStep } from "./lesson-types";

export type CheckResult =
  | { status: "empty" }
  | { status: "zero" }
  | { status: "right" }
  | { status: "right-note"; typed: number }
  | { status: "equivalent" }
  | { status: "mistake"; say: string }
  | { status: "wrong" };

// Accepts whole numbers of up to three digits and nothing else.
export function parseSlot(text: string | undefined): number | null {
  if (!text || !/^\d{1,3}$/.test(text)) return null;
  return Number(text);
}

function findMistake(step: TryStep, n: number, d: number | null): string | null {
  for (const mistake of step.mistakes ?? []) {
    if (mistake.n === undefined && mistake.d === undefined) continue;
    if (mistake.n !== undefined && mistake.n !== n) continue;
    if (mistake.d !== undefined && mistake.d !== d) continue;
    return mistake.say;
  }
  return null;
}

// Decides what a typed answer means.
// Rules: the exact expected answer is right. A fraction with the same value but a different form
// (for example 6/8 where 3/4 is expected) is NOT accepted, and the tutor explains why instead.
export function checkStep(step: TryStep, values: Record<string, string>): CheckResult {
  const n = parseSlot(values.n);
  if (n === null) return { status: "empty" };

  if (step.input === "fraction") {
    const d = parseSlot(values.d);
    if (d === null) return { status: "empty" };
    if (d === 0) return { status: "zero" };

    const expectedN = step.answer.n;
    const expectedD = step.answer.d ?? 1;
    if (n === expectedN && d === expectedD) return { status: "right" };

    const mistake = findMistake(step, n, d);
    if (mistake) return { status: "mistake", say: mistake };

    // Cross-multiplying compares two fractions without any rounding.
    if (n * expectedD === d * expectedN) return { status: "equivalent" };
    return { status: "wrong" };
  }

  if (n === step.answer.n) return { status: "right" };
  if (step.acceptMultiples && n > 0 && n % step.answer.n === 0) return { status: "right-note", typed: n };

  const mistake = findMistake(step, n, null);
  if (mistake) return { status: "mistake", say: mistake };
  return { status: "wrong" };
}

// The correct answer, as typed values.
export function answerValues(step: TryStep): Record<string, string> {
  return step.input === "fraction"
    ? { n: String(step.answer.n), d: String(step.answer.d ?? 1) }
    : { n: String(step.answer.n) };
}

// Puts values into the blanks of a line, for example "1/4 = [[n]]/12" becomes "1/4 = 3/12".
export function fillBlanks(math: string, values: Record<string, string>): string {
  return math.replace(/\[\[(\w+)\]\]/g, (_, id: string) => values[id] ?? "?");
}

// Turns maths into words so it can be read aloud or announced by a screen reader.
export function spoken(text: string): string {
  return text
    .replace(/\[\[\w+\]\]/g, "blank")
    .replace(/(\d+)\/(\d+)/g, "$1 over $2")
    .replace(/×/g, " times ")
    .replace(/÷/g, " divided by ")
    .replace(/≠/g, " is not equal to ")
    .replace(/=/g, " equals ")
    .replace(/\+/g, " plus ")
    .replace(/\s+/g, " ")
    .trim();
}
