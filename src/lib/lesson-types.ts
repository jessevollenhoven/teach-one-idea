// Describes the shape of the lesson content file (src/content/lesson.json).
// To teach a different topic, change only that JSON file. The code never contains lesson words.

export type BarRow = {
  label: string;
  parts: number;
  filled: number;
  color: "a" | "b" | "sum";
};

// A set of fraction bars. If sliceTo is set, a button cuts every bar into that many equal pieces.
export type BarsVisual = {
  type: "bars";
  rows: BarRow[];
  sliceTo?: number;
  sliced?: boolean;
  sliceLabel?: string;
  unsliceLabel?: string;
};

export type Visual = BarsVisual;

// "focus" lists the parts of a line that the tutor's highlighter points at:
// "bottom:6" (a bottom number), "top:1" (a top number), "2/6" (a whole fraction) or "6" (a plain number).
export type ExplainBlock = {
  title: string;
  say: string;
  math?: string;
  focus?: string[];
  visual?: Visual;
  list?: string[];
};

export type WorkedLine = {
  math: string;
  say: string;
  focus?: string[];
  visual?: Visual;
};

// A known wrong answer, with help written for exactly that mistake.
export type Mistake = {
  n?: number;
  d?: number;
  say: string;
};

// "math" has blanks written as [[n]] (and [[d]] for a fraction), for example "1/4 = [[n]]/12".
export type TryStep = {
  id: string;
  math: string;
  say: string;
  input: "number" | "fraction";
  answer: { n: number; d?: number };
  focus?: string[];
  acceptMultiples?: boolean;
  multipleNote?: string;
  ifEquivalent?: string;
  mistakes?: Mistake[];
  hints: string[];
  wrong?: string;
  why?: string;
};

export type ExplainPart = { kind: "explain"; title: string; blocks: ExplainBlock[] };
export type WorkedPart = { kind: "worked"; title: string; lines: WorkedLine[] };
export type TryPart = {
  kind: "guided" | "solo";
  title: string;
  problem: string;
  intro: string;
  steps: TryStep[];
  finish: string;
};
export type Part = ExplainPart | WorkedPart | TryPart;

// Words the tutor uses in every part.
export type GenericLines = {
  right: string;
  empty: string;
  zeroBottom: string;
  wrong: string;
  equivalent: string;
  nudgeHint: string;
  lastHint: string;
  reveal: string;
};

export type Lesson = {
  title: string;
  generic: GenericLines;
  parts: Part[];
};
