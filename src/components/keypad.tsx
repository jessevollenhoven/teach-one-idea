// A number pad for typing answers, so the phone's own keyboard never covers the working.
import { primaryButton, secondaryButton } from "./ui";

type KeypadProps = {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onSwap?: () => void;
  onHint: () => void;
  hintLabel: string;
  onCheck: () => void;
};

const keyClasses =
  "min-h-12 rounded-lg border-2 border-line bg-white text-xl font-semibold text-ink transition-colors active:bg-blue-soft hover:border-blue focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink";

export function Keypad({ onDigit, onBackspace, onSwap, onHint, hintLabel, onCheck }: KeypadProps) {
  const rows = [["1", "2", "3", "4", "5"], ["6", "7", "8", "9", "0"]];

  // Mouse clicks must not steal focus, or the keyboard would stop typing into the answer.
  const keepFocus = (event: React.MouseEvent) => event.preventDefault();

  return (
    <div className="mt-3 space-y-2" role="group" aria-label="Number pad">
      {rows.map((row) => (
        <div className="grid grid-cols-5 gap-2" key={row[0]}>
          {row.map((digit) => (
            <button
              className={keyClasses}
              key={digit}
              onClick={() => onDigit(digit)}
              onMouseDown={keepFocus}
              type="button"
            >
              {digit}
            </button>
          ))}
        </div>
      ))}
      <div className={`grid gap-2 ${onSwap ? "grid-cols-[3rem_3rem_1fr_1fr]" : "grid-cols-[3rem_1fr_1fr]"}`}>
        <button aria-label="Delete" className={keyClasses} onClick={onBackspace} onMouseDown={keepFocus} type="button">
          ⌫
        </button>
        {onSwap && (
          <button
            aria-label="Switch between the top and bottom number"
            className={keyClasses}
            onClick={onSwap}
            onMouseDown={keepFocus}
            type="button"
          >
            ⇅
          </button>
        )}
        <button className={secondaryButton} onClick={onHint} onMouseDown={keepFocus} type="button">
          {hintLabel}
        </button>
        <button className={primaryButton} onClick={onCheck} onMouseDown={keepFocus} type="button">
          Check
        </button>
      </div>
    </div>
  );
}
