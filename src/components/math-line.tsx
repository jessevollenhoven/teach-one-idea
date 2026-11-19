// Draws one line of working. Fractions are stacked, blanks become boxes, and the tutor's highlighter
// marks the parts listed in "focus".
import { spoken } from "../lib/fractions";
import { atomFocused, tokenFocused, tokenize, type Atom } from "../lib/math-tokens";

type MathLineProps = {
  math: string;
  focus?: string[];
  values?: Record<string, string>;
  activeSlot?: string;
  slotNames?: Record<string, string>;
  onPickSlot?: (id: string) => void;
  className?: string;
};

export function MathLine({
  math,
  focus = [],
  values = {},
  activeSlot,
  slotNames = {},
  onPickSlot,
  className = "",
}: MathLineProps) {
  function renderBlank(id: string) {
    const value = values[id] ?? "";
    const classes = `blank${activeSlot === id ? " blank-active" : ""}`;
    if (!onPickSlot) return <span className={classes}>{value || "\u00a0"}</span>;

    return (
      <button
        aria-label={`${slotNames[id] ?? "answer"}, ${value || "empty"}`}
        aria-pressed={activeSlot === id}
        className={classes}
        onClick={() => onPickSlot(id)}
        // Stops a mouse click from taking keyboard focus away from typing.
        onMouseDown={(event) => event.preventDefault()}
        type="button"
      >
        {value || "\u00a0"}
      </button>
    );
  }

  function renderAtom(atom: Atom, side: "top" | "bottom") {
    if (atom.kind === "blank") return renderBlank(atom.id);
    return atomFocused(atom, side, focus) ? <span className="mark">{atom.value}</span> : atom.value;
  }

  const tokens = tokenize(math);
  const interactive = Boolean(onPickSlot);

  return (
    <span
      className={`math ${className}`}
      {...(interactive ? {} : { role: "img", "aria-label": spoken(math) })}
    >
      {tokens.map((token, index) => {
        switch (token.kind) {
          case "text":
            return <span key={index}>{token.text}</span>;
          case "int":
            return tokenFocused(token, focus)
              ? <span className="mark" key={index}>{token.text}</span>
              : <span key={index}>{token.text}</span>;
          case "blank":
            return <span key={index}>{renderBlank(token.id)}</span>;
          case "frac":
            return (
              <span className={`frac${tokenFocused(token, focus) ? " mark" : ""}`} key={index}>
                <span className="frac-top">{renderAtom(token.top, "top")}</span>
                <span className="frac-bottom">{renderAtom(token.bottom, "bottom")}</span>
              </span>
            );
        }
      })}
    </span>
  );
}
