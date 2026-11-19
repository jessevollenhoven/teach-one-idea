// Checks the lesson file for mistakes while the site builds, so a broken lesson never goes live.
import type { Lesson, Visual } from "./lesson-types";
import { tokenize } from "./math-tokens";

function checkVisual(visual: Visual | undefined, where: string, problems: string[]) {
  if (!visual) return;
  if (visual.rows.length === 0) problems.push(`${where}: the bars need at least one row`);
  for (const row of visual.rows) {
    if (row.parts < 1 || row.filled < 0 || row.filled > row.parts) {
      problems.push(`${where}: the bar "${row.label}" has an impossible number of pieces`);
    }
    if (visual.sliceTo && visual.sliceTo % row.parts !== 0) {
      problems.push(`${where}: the bar "${row.label}" can’t be cut evenly into ${visual.sliceTo} pieces`);
    }
  }
}

function checkMath(math: string, where: string, problems: string[]) {
  if (!math.trim()) problems.push(`${where}: the line of working is empty`);
  if (math.includes("[[") && tokenize(math).every((token) => token.kind !== "blank" && token.kind !== "frac")) {
    problems.push(`${where}: the blanks in "${math}" are not written correctly`);
  }
}

export function validateLesson(lesson: Lesson): string[] {
  const problems: string[] = [];
  if (!lesson.title.trim()) problems.push("The lesson needs a title");
  if (lesson.parts.length === 0) problems.push("The lesson needs at least one part");

  lesson.parts.forEach((part, partIndex) => {
    const here = `Part ${partIndex + 1} (${part.title})`;
    if (part.kind === "explain") {
      if (part.blocks.length === 0) problems.push(`${here}: needs at least one block`);
      part.blocks.forEach((block, i) => {
        if (!block.say.trim()) problems.push(`${here}, block ${i + 1}: the tutor has nothing to say`);
        if (block.math) checkMath(block.math, `${here}, block ${i + 1}`, problems);
        checkVisual(block.visual, `${here}, block ${i + 1}`, problems);
      });
    } else if (part.kind === "worked") {
      if (part.lines.length === 0) problems.push(`${here}: needs at least one line`);
      part.lines.forEach((line, i) => {
        if (!line.say.trim()) problems.push(`${here}, line ${i + 1}: the tutor has nothing to say`);
        checkMath(line.math, `${here}, line ${i + 1}`, problems);
        checkVisual(line.visual, `${here}, line ${i + 1}`, problems);
      });
    } else {
      if (part.steps.length === 0) problems.push(`${here}: needs at least one step`);
      checkMath(part.problem, `${here}, problem`, problems);
      part.steps.forEach((step) => {
        const stepHere = `${here}, step "${step.id}"`;
        const blanks = new Set<string>();
        for (const token of tokenize(step.math)) {
          if (token.kind === "blank") blanks.add(token.id);
          if (token.kind === "frac") {
            if (token.top.kind === "blank") blanks.add(token.top.id);
            if (token.bottom.kind === "blank") blanks.add(token.bottom.id);
          }
        }
        const expected = step.input === "fraction" ? ["d", "n"] : ["n"];
        if ([...blanks].sort().join() !== expected.join()) {
          problems.push(`${stepHere}: a ${step.input} step needs the blanks ${expected.map((id) => `[[${id}]]`).join(" and ")}`);
        }
        if (!Number.isInteger(step.answer.n) || step.answer.n < 0 || step.answer.n > 999) {
          problems.push(`${stepHere}: the answer must be a whole number from 0 to 999`);
        }
        if (step.input === "fraction" && (!step.answer.d || step.answer.d < 1 || step.answer.d > 999)) {
          problems.push(`${stepHere}: a fraction answer needs a bottom number from 1 to 999`);
        }
        if (step.acceptMultiples && !step.multipleNote) {
          problems.push(`${stepHere}: acceptMultiples needs a multipleNote`);
        }
        if (step.hints.length === 0) problems.push(`${stepHere}: needs at least one hint, so the learner is never stuck`);
      });
    }
  });
  return problems;
}
