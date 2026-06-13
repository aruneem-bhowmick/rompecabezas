import type { ReactElement } from 'react';

/**
 * Root application component.
 *
 * Renders a minimal placeholder that applies the project's typography
 * system — Bricolage Grotesque for display headings and Inter for body
 * text — and verifies tabular numeral rendering for timer-style content.
 *
 * @returns The top-level React element for the application.
 */
export default function App(): ReactElement {
  return (
    <div data-testid="app-root" className="min-h-screen bg-paper font-body text-ink">
      <h1 className="font-display text-4xl font-bold">Rompecabezas</h1>
      <p>A jigsaw puzzle for your browser.</p>
      <p className="tabular-nums" data-testid="timer-sample">
        00:00
      </p>
    </div>
  );
}
