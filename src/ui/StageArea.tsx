import type { ReactElement } from 'react';
import PuzzleCanvas from '../engine/puzzleCanvas';

/**
 * Central puzzle stage area.
 *
 * Fills remaining vertical space with a felt-green background and an
 * inset shadow that gives the appearance of a recessed puzzle tray.
 * Renders the PuzzleCanvas component which constructs and manages the
 * headbreaker jigsaw puzzle engine.
 */
export default function StageArea(): ReactElement {
  return (
    <main
      className="relative flex flex-1 items-center justify-center bg-felt"
      style={{ boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.3)' }}
    >
      <PuzzleCanvas />
    </main>
  );
}
