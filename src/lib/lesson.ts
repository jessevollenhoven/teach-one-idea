// Loads the lesson file and stops the build if it has mistakes.
import raw from "../content/lesson.json";
import type { Lesson } from "./lesson-types";
import { validateLesson } from "./validate-lesson";

export const lesson = raw as unknown as Lesson;

const problems = validateLesson(lesson);
if (problems.length > 0) {
  throw new Error(`The lesson file has problems:\n- ${problems.join("\n- ")}`);
}
