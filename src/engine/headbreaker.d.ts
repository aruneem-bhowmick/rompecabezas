/**
 * Ambient type declarations for the headbreaker puzzle engine.
 *
 * headbreaker v3 does not ship its own TypeScript definitions.
 * This file provides the subset of the API surface used by the
 * puzzle engine wrapper, typed strictly enough to prevent implicit
 * `any` from leaking into consuming code.
 *
 * Refine as additional API surface is consumed.
 */
declare module 'headbreaker' {
  export class Canvas {
    constructor(id: string, options: Record<string, unknown>);
    autogenerate(options: Record<string, unknown>): void;
    adjustImagesToPuzzleHeight(): void;
    shuffle(spread: number): void;
    draw(): void;
    clear(): void;
    redraw(): void;
    onConnect(callback: (...args: unknown[]) => void): void;
    onValid(callback: () => void): void;
    attachSolvedValidator(): void;
    puzzle: unknown;
  }

  export const painters: {
    Konva: new () => unknown;
    Dummy: new () => unknown;
  };

  export const generators: {
    fixed: (index: number) => unknown;
    flipflop: (index: number) => unknown;
    twoAndTwo: (index: number) => unknown;
    random: (index: number) => unknown;
  };

  export const outline: {
    Rounded: new () => unknown;
    Squared: new () => unknown;
  };
}
