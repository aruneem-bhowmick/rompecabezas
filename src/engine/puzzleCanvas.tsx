/**
 * PuzzleCanvas React wrapper component.
 *
 * Bridges the headbreaker Canvas engine with the React lifecycle.
 * Constructs the canvas inside a `useEffect`, loads the sample image,
 * computes letterboxed board dimensions, wires piece interaction events,
 * and tears down cleanly on unmount (including StrictMode double-mount).
 */
import { useEffect, useId, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { Canvas } from 'headbreaker';
import { loadImage } from './loadImage';
import { sampleUrl } from './sampleImage';
import { computeEngineOptions, computeAutogenerateOptions } from './engineOptions';

/** Props for the PuzzleCanvas component (empty for now). */
export type PuzzleCanvasProps = Record<string, never>;

const COLS = 4;
const ROWS = 3;
const SHUFFLE_SPREAD = 0.7;

export default function PuzzleCanvas(_props: PuzzleCanvasProps): ReactElement {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<Canvas | null>(null);
  const mountId = useId();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const mountEl = mountRef.current;

    async function init() {
      try {
        const image = await loadImage(sampleUrl);
        if (cancelled) return;

        if (!mountEl) return;

        const containerW = mountEl.clientWidth;
        const containerH = mountEl.clientHeight;

        if (containerW <= 0 || containerH <= 0) {
          setError('Unable to measure puzzle container');
          setLoading(false);
          return;
        }

        // Letterbox: fit image aspect ratio into the container
        const imgAspect = image.naturalWidth / image.naturalHeight;
        const containerAspect = containerW / containerH;

        let boardW: number;
        let boardH: number;

        if (imgAspect > containerAspect) {
          // Image is wider than container — constrain by width
          boardW = containerW;
          boardH = containerW / imgAspect;
        } else {
          // Image is taller than container — constrain by height
          boardH = containerH;
          boardW = containerH * imgAspect;
        }

        const options = computeEngineOptions({
          boardW,
          boardH,
          cols: COLS,
          rows: ROWS,
          image,
        });

        const canvas = new Canvas(
          mountId,
          options as unknown as Record<string, unknown>,
        );
        canvas.adjustImagesToPuzzleHeight();
        canvas.autogenerate(
          computeAutogenerateOptions(COLS, ROWS) as unknown as Record<
            string,
            unknown
          >,
        );
        canvas.shuffle(SHUFFLE_SPREAD);
        canvas.draw();

        // Flash stroke on piece connection
        const prefersReducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches;

        type Figure = { shape?: { stroke: (c?: string) => string } };

        canvas.onConnect((...args: unknown[]) => {
          const figure = args[1] as Figure;
          if (prefersReducedMotion || !figure.shape) return;

          figure.shape.stroke('#e8a13a');
          canvas.redraw();

          setTimeout(() => {
            figure.shape?.stroke(options.strokeColor);
            canvas.redraw();
          }, 200);
        });

        canvas.attachSolvedValidator();
        canvas.onValid(() => {
          console.log('Puzzle solved!');
        });

        canvasRef.current = canvas;

        if (!cancelled) {
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError('Failed to load puzzle');
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      canvasRef.current?.clear();
      if (mountEl) {
        while (mountEl.firstChild) {
          mountEl.removeChild(mountEl.firstChild);
        }
      }
      canvasRef.current = null;
    };
  }, [mountId]);

  return (
    <div
      ref={mountRef}
      id={mountId}
      data-testid="puzzle-canvas"
      className="h-full w-full"
      style={{ position: 'relative' }}
    >
      {loading && (
        <span className="text-paper/60" aria-live="polite">
          Loading puzzle...
        </span>
      )}
      {error && (
        <span className="text-paper" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
