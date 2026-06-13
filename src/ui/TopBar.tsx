import type { ReactElement } from 'react';

/**
 * Application header bar.
 *
 * Displays the wordmark, a placeholder for difficulty controls, and
 * the timer readout. The wordmark shortens to "Rompe" below the `sm`
 * breakpoint for compact viewports.
 */
export default function TopBar(): ReactElement {
  return (
    <header className="flex items-center justify-between border-b border-line px-4 py-3">
      <h1 className="font-display text-xl font-bold sm:text-2xl">
        <span className="hidden sm:inline">Rompecabezas</span>
        <span className="inline sm:hidden">Rompe</span>
      </h1>
      <span className="text-sm text-slate">Difficulty controls</span>
      <span className="font-body tabular-nums text-marigold" data-testid="timer-sample">
        00:00
      </span>
    </header>
  );
}
