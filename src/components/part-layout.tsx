// The same layout for every part: the working on one side and the tutor's dock on the other.
// On a phone the dock sits at the bottom, where the thumb is. On a laptop it sits beside the working.
import type { ReactNode } from "react";

export function PartLayout({ work, dock }: { work: ReactNode; dock: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-7.5rem)] max-w-5xl flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-start lg:gap-10 lg:px-4">
      <div className="flex-1 px-4 py-5 lg:px-0 lg:py-10">{work}</div>
      <div className="sticky bottom-0 space-y-3 border-t-2 border-ink bg-white px-4 py-3 lg:top-6 lg:mt-10 lg:rounded-xl lg:border-2 lg:p-4">
        {dock}
      </div>
    </div>
  );
}
