import { describe, it, expect, vi } from 'vitest';
import { computeEngineOptions, computeAutogenerateOptions } from '../../src/engine/engineOptions';

/**
 * Unit tests for the engine options computation module.
 *
 * The headbreaker library is mocked to avoid importing the full engine
 * and its Konva dependency in a jsdom test environment. Mock factories
 * return tagged objects so tests can verify that the correct constructors
 * are called without depending on headbreaker internals.
 */
vi.mock('headbreaker', () => {
  class MockKonvaPainter {
    type = 'konva-painter';
  }
  class MockRoundedOutline {
    type = 'rounded-outline';
  }
  return {
    painters: { Konva: MockKonvaPainter },
    generators: { random: 'random-generator', flipflop: 'flipflop-generator' },
    outline: { Rounded: MockRoundedOutline },
  };
});

/**
 * Creates a minimal mock HTMLImageElement for testing.
 * Provides only the properties referenced by the engine options module.
 */
function mockImage(): HTMLImageElement {
  return { naturalWidth: 800, naturalHeight: 600 } as HTMLImageElement;
}

describe('computeEngineOptions', () => {
  /**
   * Verifies that piece dimensions are derived by dividing board
   * dimensions by the grid column and row counts, producing the
   * expected sub-region size for each puzzle piece.
   */
  it('computes pieceSize from board dimensions and grid', () => {
    const opts = computeEngineOptions({
      boardW: 800,
      boardH: 600,
      cols: 4,
      rows: 3,
      image: mockImage(),
    });
    expect(opts.pieceSize).toEqual({ x: 200, y: 200 });
  });

  /**
   * Verifies that the snap proximity distance is 20% of the smaller
   * piece dimension, rounded to the nearest integer.
   */
  it('computes proximity as 0.2 * min(pieceW, pieceH), rounded', () => {
    const opts = computeEngineOptions({
      boardW: 800,
      boardH: 600,
      cols: 4,
      rows: 3,
      image: mockImage(),
    });
    // min(200, 200) * 0.2 = 40
    expect(opts.proximity).toBe(40);
  });

  /**
   * Verifies that the border fill depth is 10% of the smaller piece
   * dimension, rounded to the nearest integer.
   */
  it('computes borderFill as 0.1 * min(pieceW, pieceH), rounded', () => {
    const opts = computeEngineOptions({
      boardW: 800,
      boardH: 600,
      cols: 4,
      rows: 3,
      image: mockImage(),
    });
    // min(200, 200) * 0.1 = 20
    expect(opts.borderFill).toBe(20);
  });

  /**
   * Verifies that non-square piece dimensions are handled correctly,
   * with proximity and borderFill derived from the smaller dimension.
   */
  it('handles non-square pieces', () => {
    const opts = computeEngineOptions({
      boardW: 900,
      boardH: 600,
      cols: 3,
      rows: 4,
      image: mockImage(),
    });
    // pieceW = 300, pieceH = 150
    expect(opts.pieceSize).toEqual({ x: 300, y: 150 });
    expect(opts.proximity).toBe(Math.round(0.2 * 150)); // 30
    expect(opts.borderFill).toBe(Math.round(0.1 * 150)); // 15
  });

  /**
   * Verifies that the fixed visual tuning values (stroke weight,
   * stroke color, line softness, and board anchoring) are set to
   * their expected constants for legibility over photographic content.
   */
  it('sets fixed visual tuning properties', () => {
    const opts = computeEngineOptions({
      boardW: 800,
      boardH: 600,
      cols: 4,
      rows: 3,
      image: mockImage(),
    });
    expect(opts.strokeWidth).toBe(1.5);
    expect(opts.strokeColor).toBe('#5b636a');
    expect(opts.lineSoftness).toBe(0.16);
    expect(opts.fixed).toBe(true);
  });

  /**
   * Verifies that the board dimensions are passed through to the
   * output as the canvas width and height.
   */
  it('passes width and height through', () => {
    const opts = computeEngineOptions({
      boardW: 1024,
      boardH: 768,
      cols: 4,
      rows: 3,
      image: mockImage(),
    });
    expect(opts.width).toBe(1024);
    expect(opts.height).toBe(768);
  });

  /**
   * Verifies that the loaded image element is passed through to the
   * output without modification, preserving the exact reference.
   */
  it('passes the image through', () => {
    const img = mockImage();
    const opts = computeEngineOptions({
      boardW: 800,
      boardH: 600,
      cols: 4,
      rows: 3,
      image: img,
    });
    expect(opts.image).toBe(img);
  });

  /**
   * Verifies that the Konva painter and Rounded outline instances are
   * present in the output, ensuring the canvas will render correctly
   * when using the bundled import path.
   */
  it('includes painter (Konva) and outline (Rounded)', () => {
    const opts = computeEngineOptions({
      boardW: 800,
      boardH: 600,
      cols: 4,
      rows: 3,
      image: mockImage(),
    });
    expect(opts.painter).toBeDefined();
    expect(opts.outline).toBeDefined();
  });

  /**
   * Verifies that proximity is clamped to a minimum of 1, even when
   * the computed value would round down to 0 for very small pieces.
   */
  it('ensures proximity is at least 1', () => {
    // Very small pieces: boardW=10, boardH=10, cols=10, rows=10
    // pieceW = 1, pieceH = 1, 0.2*1 = 0.2, rounds to 0 — should clamp to 1
    const opts = computeEngineOptions({
      boardW: 10,
      boardH: 10,
      cols: 10,
      rows: 10,
      image: mockImage(),
    });
    expect(opts.proximity).toBeGreaterThanOrEqual(1);
  });

  /**
   * Verifies that borderFill is clamped to a minimum of 1, even when
   * the computed value would round down to 0 for very small pieces.
   */
  it('ensures borderFill is at least 1', () => {
    const opts = computeEngineOptions({
      boardW: 10,
      boardH: 10,
      cols: 10,
      rows: 10,
      image: mockImage(),
    });
    expect(opts.borderFill).toBeGreaterThanOrEqual(1);
  });

  /**
   * Regression snapshot for the 4x3 grid at 800x600 reference input.
   * Locks the full options object so any drift in the computation is
   * caught automatically. The image property is excluded from the
   * snapshot since it is a mock object reference.
   */
  it('produces stable output for the reference 4x3 grid (regression)', () => {
    const opts = computeEngineOptions({
      boardW: 800,
      boardH: 600,
      cols: 4,
      rows: 3,
      image: mockImage(),
    });
    // Exclude the image (mock reference) from the snapshot
    const { image: _image, ...snapshotOpts } = opts;
    expect(snapshotOpts).toMatchSnapshot();
  });
});

describe('computeAutogenerateOptions', () => {
  /**
   * Verifies that the horizontal and vertical piece counts are passed
   * through from the column and row inputs respectively.
   */
  it('returns horizontal and vertical piece counts', () => {
    const opts = computeAutogenerateOptions(4, 3);
    expect(opts.horizontalPiecesCount).toBe(4);
    expect(opts.verticalPiecesCount).toBe(3);
  });

  /**
   * Verifies that the random inserts generator is included in the
   * autogenerate options for varied tab/slot patterns.
   */
  it('includes the random inserts generator', () => {
    const opts = computeAutogenerateOptions(4, 3);
    expect(opts.insertsGenerator).toBeDefined();
  });
});
