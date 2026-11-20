// Shared button styles. Every button is at least 48px tall so it is easy to tap.
// The main button takes the colour of the current part.
export const primaryButton =
  "inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-field px-5 text-base font-bold text-on-field transition-opacity hover:opacity-90 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40";

export const secondaryButton =
  "inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-ink bg-white px-4 text-base font-bold text-ink transition-colors hover:bg-key focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40";
