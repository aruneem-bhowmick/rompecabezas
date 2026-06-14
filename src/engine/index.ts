/**
 * Engine module barrel.
 *
 * Re-exports the headbreaker and konva symbols used by the puzzle
 * engine wrapper. This file exists to verify that the bundled import
 * path resolves cleanly under Vite and to centralize engine imports.
 */
export { Canvas, painters, generators, outline } from 'headbreaker';
export { default as Konva } from 'konva';
