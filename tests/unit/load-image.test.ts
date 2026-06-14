import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { loadImage } from '../../src/engine/loadImage';

/**
 * Unit tests for the loadImage utility.
 *
 * The jsdom environment does not perform real network image loads,
 * so these tests replace the global Image constructor with a mock
 * that simulates onload (success) and onerror (failure) events
 * asynchronously, matching real browser behavior.
 */
describe('loadImage', () => {
  let originalImage: typeof globalThis.Image;

  beforeEach(() => {
    originalImage = globalThis.Image;
  });

  afterEach(() => {
    globalThis.Image = originalImage;
    vi.restoreAllMocks();
  });

  /**
   * Creates a mock Image constructor that triggers onload or onerror
   * asynchronously when src is assigned, simulating real browser behavior.
   */
  function createMockImageClass(shouldSucceed: boolean) {
    return class MockImage {
      crossOrigin: string | null = null;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      naturalWidth = 800;
      naturalHeight = 600;
      private _src = '';

      get src() {
        return this._src;
      }

      set src(value: string) {
        this._src = value;
        setTimeout(() => {
          if (shouldSucceed) {
            this.onload?.();
          } else {
            this.onerror?.();
          }
        }, 0);
      }
    } as unknown as typeof globalThis.Image;
  }

  /**
   * Verifies that loadImage resolves with an HTMLImageElement when
   * the image source loads successfully.
   */
  it('resolves with an HTMLImageElement on successful load', async () => {
    globalThis.Image = createMockImageClass(true);

    const img = await loadImage('https://example.com/photo.jpg');
    expect(img).toBeDefined();
    expect(img.src).toBe('https://example.com/photo.jpg');
  });

  /**
   * Verifies that loadImage rejects with a descriptive Error when
   * the image fails to load (network error, 404, corrupt file, etc.).
   */
  it('rejects with an error on load failure', async () => {
    globalThis.Image = createMockImageClass(false);

    await expect(loadImage('https://example.com/bad.jpg')).rejects.toThrow(
      'Failed to load image: https://example.com/bad.jpg',
    );
  });

  /**
   * Verifies that loadImage sets crossOrigin to 'anonymous' before
   * assigning the src attribute, preventing tainted-canvas errors
   * when performing pixel operations on the loaded image.
   */
  it('sets crossOrigin to anonymous before setting src', async () => {
    let crossOriginAtSrcSet: string | null = null;

    globalThis.Image = class MockImage {
      crossOrigin: string | null = null;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      private _src = '';

      get src() {
        return this._src;
      }

      set src(value: string) {
        // Capture crossOrigin at the moment src is assigned
        crossOriginAtSrcSet = this.crossOrigin;
        this._src = value;
        setTimeout(() => {
          this.onload?.();
        }, 0);
      }
    } as unknown as typeof globalThis.Image;

    await loadImage('https://example.com/photo.jpg');
    expect(crossOriginAtSrcSet).toBe('anonymous');
  });

  /**
   * Verifies that the error message includes the failing URL,
   * providing useful debugging context when image loads fail.
   */
  it('includes the source URL in the rejection error message', async () => {
    globalThis.Image = createMockImageClass(false);

    const url = '/assets/missing-image.png';
    await expect(loadImage(url)).rejects.toThrow(`Failed to load image: ${url}`);
  });

  /**
   * Verifies that loadImage returns a Promise (i.e., it is async)
   * so callers can properly await the image load.
   */
  it('returns a Promise', () => {
    globalThis.Image = createMockImageClass(true);

    const result = loadImage('https://example.com/photo.jpg');
    expect(result).toBeInstanceOf(Promise);
  });
});
