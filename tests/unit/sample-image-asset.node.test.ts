import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Node-based tests that verify the sample image asset exists on disk
 * and meets the structural requirements for use as a puzzle source:
 * valid JPEG format, landscape orientation, and minimum resolution.
 *
 * These run outside jsdom using Node.js filesystem access to inspect
 * the raw image file bytes and JFIF/EXIF headers.
 */
describe('sample.jpg asset file', () => {
  const assetPath = resolve(__dirname, '../../src/assets/sample.jpg');

  /**
   * Confirms the asset file is committed and accessible at the
   * expected path within the source tree.
   */
  it('exists at src/assets/sample.jpg', () => {
    expect(existsSync(assetPath)).toBe(true);
  });

  /**
   * Validates that the file starts with the JPEG magic bytes (FFD8FF),
   * confirming it is a genuine JPEG file rather than a misnamed format.
   */
  it('is a valid JPEG file (starts with FFD8FF magic bytes)', () => {
    const buffer = readFileSync(assetPath);
    // JPEG files start with FF D8 FF
    expect(buffer[0]).toBe(0xff);
    expect(buffer[1]).toBe(0xd8);
    expect(buffer[2]).toBe(0xff);
  });

  /**
   * Verifies the file has non-trivial content (not an empty or stub file).
   * A real JPEG image of 800x600 should be at least a few KB.
   */
  it('has reasonable file size (at least 5KB)', () => {
    const buffer = readFileSync(assetPath);
    expect(buffer.length).toBeGreaterThan(5 * 1024);
  });

  /**
   * Parses the JPEG SOF0 (Start of Frame) marker to extract image
   * dimensions and verifies landscape orientation (width > height)
   * with a minimum resolution of 800x600.
   */
  it('is landscape orientation with at least 800x600 resolution', () => {
    const buffer = readFileSync(assetPath);
    const dimensions = parseJpegDimensions(buffer);

    expect(dimensions).not.toBeNull();
    if (dimensions) {
      expect(dimensions.width).toBeGreaterThanOrEqual(800);
      expect(dimensions.height).toBeGreaterThanOrEqual(600);
      expect(dimensions.width).toBeGreaterThan(dimensions.height);
    }
  });
});

/**
 * Parse JPEG SOF (Start of Frame) markers to extract image dimensions.
 * Scans for SOF0 (0xFFC0) or SOF2 (0xFFC2) markers in the JPEG data.
 *
 * @param buffer - Raw JPEG file bytes.
 * @returns Width and height if found, null otherwise.
 */
function parseJpegDimensions(buffer: Buffer): { width: number; height: number } | null {
  let offset = 2; // Skip SOI marker (FF D8)

  while (offset < buffer.length - 1) {
    if (buffer[offset] !== 0xff) {
      offset++;
      continue;
    }

    const marker = buffer[offset + 1];

    // SOF0 (baseline) or SOF2 (progressive) markers
    if (marker === 0xc0 || marker === 0xc2) {
      // SOF marker structure: FF C0 LL LL PP HHHH WWWW ...
      // Height at offset+5 (2 bytes), Width at offset+7 (2 bytes)
      if (offset + 8 < buffer.length) {
        const height = (buffer[offset + 5]! << 8) | buffer[offset + 6]!;
        const width = (buffer[offset + 7]! << 8) | buffer[offset + 8]!;
        return { width, height };
      }
    }

    // Skip to next marker using segment length
    if (marker >= 0xc0 && marker !== 0xff) {
      if (offset + 3 < buffer.length) {
        const segmentLength = (buffer[offset + 2]! << 8) | buffer[offset + 3]!;
        offset += 2 + segmentLength;
      } else {
        break;
      }
    } else {
      offset++;
    }
  }

  return null;
}
