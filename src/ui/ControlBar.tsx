import type { ReactElement } from 'react';

const BUTTONS = ['Shuffle', 'Hint', 'Sound', 'Reset', 'New image'] as const;

/**
 * Bottom control bar with action buttons and progress indicator.
 *
 * All buttons are disabled until gameplay is wired up. A placeholder
 * progress counter sits on the right side.
 */
export default function ControlBar(): ReactElement {
  return (
    <footer className="flex items-center justify-between border-t border-line px-4 py-3">
      <div className="flex gap-2">
        {BUTTONS.map((label) => (
          <button
            key={label}
            type="button"
            disabled
            aria-disabled="true"
            className="rounded-card bg-slate/10 px-3 py-1.5 text-sm text-ink opacity-60 cursor-not-allowed"
          >
            {label}
          </button>
        ))}
      </div>
      <span className="text-sm text-slate">0 / 0 connected</span>
    </footer>
  );
}
