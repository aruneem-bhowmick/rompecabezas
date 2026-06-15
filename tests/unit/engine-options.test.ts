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
   * Verifies that the painter and outline are instances of the
   * expected mock constructors by checking the type tags set during
   * construction, and that each call produces fresh instances rather
   * than returning cached singletons.
   */
  it('includes painter (Konva) and outline (Rounded) as fresh instances', () => {
    const input = {
      boardW: 800,
      boardH: 600,
      cols: 4,
      rows: 3,
      image: mockImage(),
    };
    const opts1 = computeEngineOptions(input);
    const opts2 = computeEngineOptions(input);

    // Identity: correct constructor produced each instance
    expect((opts1.painter as { type: string }).type).toBe('konva-painter');
    expect((opts1.outline as { type: string }).type).toBe('rounded-outline');

    // Freshness: each call returns new instances, not cached references
    expect(opts1.painter).not.toBe(opts2.painter);
    expect(opts1.outline).not.toBe(opts2.outline);
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
   * Verifies that zero cols or rows throws a RangeError instead of
   * silently producing Infinity from the division.
   */
  it('throws RangeError when cols is zero', () => {
    expect(() =>
      computeEngineOptions({
        boardW: 800,
        boardH: 600,
        cols: 0,
        rows: 3,
        image: mockImage(),
      }),
    ).toThrow(RangeError);
  });

  it('throws RangeError when rows is zero', () => {
    expect(() =>
      computeEngineOptions({
        boardW: 800,
        boardH: 600,
        cols: 4,
        rows: 0,
        image: mockImage(),
      }),
    ).toThrow(RangeError);
  });

  /**
   * Verifies that negative grid dimensions are rejected.
   */
  it('throws RangeError when cols is negative', () => {
    expect(() =>
      computeEngineOptions({
        boardW: 800,
        boardH: 600,
        cols: -2,
        rows: 3,
        image: mockImage(),
      }),
    ).toThrow(RangeError);
  });

  /**
   * Verifies that zero or negative board dimensions are rejected
   * before reaching the division operations.
   */
  it('throws RangeError when boardW is zero', () => {
    expect(() =>
      computeEngineOptions({
        boardW: 0,
        boardH: 600,
        cols: 4,
        rows: 3,
        image: mockImage(),
      }),
    ).toThrow(RangeError);
  });

  it('throws RangeError when boardH is negative', () => {
    expect(() =>
      computeEngineOptions({
        boardW: 800,
        boardH: -100,
        cols: 4,
        rows: 3,
        image: mockImage(),
      }),
    ).toThrow(RangeError);
  });

  /**
   * Verifies that the error message includes the offending values
   * for debugging.
   */
  it('includes offending values in the error message', () => {
    expect(() =>
      computeEngineOptions({
        boardW: 800,
        boardH: 600,
        cols: 0,
        rows: -1,
        image: mockImage(),
      }),
    ).toThrow(/cols=0/);
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
    expect({ ...opts, image: '[mock HTMLImageElement]' }).toMatchSnapshot();
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
