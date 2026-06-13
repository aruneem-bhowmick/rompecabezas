import type { ReactElement } from 'react';

/**
 * Central puzzle stage area.
 *
 * Fills remaining vertical space with a felt-green background and an
 * inset shadow that gives the appearance of a recessed puzzle tray.
 * Contains a mount point for the future puzzle canvas.
 */
export default function StageArea(): ReactElement {
  return (
    <main
      className="relative flex flex-1 items-center justify-center bg-felt"
      style={{ boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.3)' }}
    >
      <div id="puzzle-mount" />
      <span className="pointer-events-none select-none text-lg text-paper/40" aria-hidden="true">
        Puzzle board
      </span>
    </main>
  );
}
