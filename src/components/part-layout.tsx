// The same layout for every part: the working sits on the part's colour field, and the tutor's dock
// is a white sheet. On a phone the sheet is at the bottom, where the thumb is. On a laptop it sits beside the working.
import type { ReactNode } from "react";

export function PartLayout({ work, dock }: { work: ReactNode; dock: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-7.5rem)] max-w-5xl flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-start lg:gap-10 lg:px-4">
      <div className="flex-1 px-4 py-6 lg:px-0 lg:py-10">{work}</div>
      <div className="sticky bottom-0 space-y-3 rounded-t-3xl bg-white text-ink px-4 pb-4 pt-4 shadow-[0_-6px_0_0_rgb(0_0_0/0.12)] lg:top-6 lg:mt-10 lg:rounded-3xl lg:p-5 lg:shadow-none">
        {dock}
      </div>
    </div>
  );
}
