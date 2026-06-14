/**
 * Engine module barrel.
 *
 * Re-exports the headbreaker and konva symbols used by the puzzle
 * engine wrapper, along with image-loading utilities. This file
 * exists to verify that the bundled import path resolves cleanly
 * under Vite and to centralize engine imports.
 */
export { Canvas, painters, generators, outline } from 'headbreaker';
export { default as Konva } from 'konva';
export { loadImage } from './loadImage';
export { sampleUrl } from './sampleImage';
export { computeEngineOptions, computeAutogenerateOptions } from './engineOptions';
export type { EngineInput, CanvasOptions, AutogenerateOptions } from './engineOptions';
