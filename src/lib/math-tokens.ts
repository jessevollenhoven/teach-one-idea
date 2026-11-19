// Splits a line of working such as "1/4 = [[n]]/12" into pieces that can be drawn.
export type Atom = { kind: "num"; value: string } | { kind: "blank"; id: string };

export type Token =
  | { kind: "text"; text: string }
  | { kind: "int"; text: string }
  | { kind: "blank"; id: string }
  | { kind: "frac"; top: Atom; bottom: Atom; text: string };

// Order matters: a fraction is tried first, then a lone blank, then a whole number, then anything else.
const pattern = /(?:(\d+)|\[\[(\w+)\]\])\/(?:(\d+)|\[\[(\w+)\]\])|\[\[(\w+)\]\]|(\d+)|([^\d[]+|\[)/g;

export function tokenize(math: string): Token[] {
  const tokens: Token[] = [];
  for (const match of math.matchAll(pattern)) {
    const [text, topNum, topBlank, bottomNum, bottomBlank, blank, int, other] = match;
    if (topNum !== undefined || topBlank !== undefined) {
      tokens.push({
        kind: "frac",
        text,
        top: topNum !== undefined ? { kind: "num", value: topNum } : { kind: "blank", id: topBlank },
        bottom: bottomNum !== undefined ? { kind: "num", value: bottomNum } : { kind: "blank", id: bottomBlank },
      });
    } else if (blank !== undefined) {
      tokens.push({ kind: "blank", id: blank });
    } else if (int !== undefined) {
      tokens.push({ kind: "int", text: int });
    } else if (other !== undefined) {
      tokens.push({ kind: "text", text: other });
    }
  }
  return tokens;
}

// Does the tutor's highlighter point at this whole token (a fraction or a plain number)?
export function tokenFocused(token: Token, focus: string[]): boolean {
  return (token.kind === "frac" || token.kind === "int") && focus.includes(token.text);
}

// Does it point at just the top or the bottom of a fraction?
export function atomFocused(atom: Atom, side: "top" | "bottom", focus: string[]): boolean {
  return atom.kind === "num" && focus.includes(`${side}:${atom.value}`);
}
