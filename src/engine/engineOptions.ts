/**
 * Engine options computation module.
 *
 * Provides pure functions that compute the headbreaker Canvas constructor
 * options and autogenerate options from board dimensions, grid size, and
 * a loaded image. Isolating this computation ensures deterministic,
 * unit-testable option mapping and keeps headbreaker-specific imports
 * centralized within the engine layer.
 */
import { painters, generators, outline } from 'headbreaker';

/** Input parameters for computing engine options. */
export interface EngineInput {
  /** Canvas width in CSS pixels. Must be positive (> 0). */
  boardW: number;
  /** Canvas height in CSS pixels. Must be positive (> 0). */
  boardH: number;
  /** Number of horizontal pieces (columns). Positive integer >= 1. */
  cols: number;
  /** Number of vertical pieces (rows). Positive integer >= 1. */
  rows: number;
  /** The loaded, ready HTMLImageElement. */
  image: HTMLImageElement;
}

/** The options object passed to `new headbreaker.Canvas(id, options)`. */
export interface CanvasOptions {
  width: number;
  height: number;
  pieceSize: { x: number; y: number };
  proximity: number;
  borderFill: number;
  strokeWidth: number;
  strokeColor: string;
  lineSoftness: number;
  image: HTMLImageElement;
  fixed: boolean;
  outline: unknown;
  painter: unknown;
}

/** Options for `canvas.autogenerate()`. */
export interface AutogenerateOptions {
  horizontalPiecesCount: number;
  verticalPiecesCount: number;
  insertsGenerator: unknown;
}

/**
 * Compute the headbreaker Canvas constructor options from board
 * dimensions, grid size, and a loaded image.
 *
 * Derives piece size, snap proximity, and border fill depth from the
 * board dimensions and grid, while applying fixed visual tuning values
 * (stroke, softness, outline style) optimized for legibility over
 * photographic content.
 *
 * @param input - Board dimensions, grid size, and the loaded image.
 * @returns The fully assembled options object for `new Canvas(id, opts)`.
 * @throws {RangeError} If cols, rows, boardW, or boardH are zero or negative.
 */
export function computeEngineOptions(input: EngineInput): CanvasOptions {
  const { boardW, boardH, cols, rows, image } = input;

  if (cols <= 0 || rows <= 0) {
    throw new RangeError(
      `cols and rows must be positive numbers, got cols=${cols}, rows=${rows}`,
    );
  }
  if (boardW <= 0 || boardH <= 0) {
    throw new RangeError(
      `boardW and boardH must be positive numbers, got boardW=${boardW}, boardH=${boardH}`,
    );
  }

  const pieceW = boardW / cols;
  const pieceH = boardH / rows;
  const minDim = Math.min(pieceW, pieceH);

  const proximity = Math.max(1, Math.round(0.2 * minDim));
  const borderFill = Math.max(1, Math.round(0.1 * minDim));

  return {
    width: boardW,
    height: boardH,
    pieceSize: { x: pieceW, y: pieceH },
    proximity,
    borderFill,
    strokeWidth: 1.5,
    strokeColor: '#5b636a',
    lineSoftness: 0.16,
    image,
    fixed: true,
    outline: new outline.Rounded(),
    painter: new painters.Konva(),
  };
}

/**
 * Compute the autogenerate options for a given grid size.
 *
 * Returns the piece counts and insert generator configuration that
 * headbreaker's `canvas.autogenerate()` method expects. Uses a random
 * insert generator for varied tab/slot patterns across the grid.
 *
 * @param cols - Number of horizontal pieces (columns).
 * @param rows - Number of vertical pieces (rows).
 * @returns The options object for `canvas.autogenerate(opts)`.
 */
export function computeAutogenerateOptions(
  cols: number,
  rows: number,
): AutogenerateOptions {
  return {
    horizontalPiecesCount: cols,
    verticalPiecesCount: rows,
    insertsGenerator: generators.random,
  };
}
