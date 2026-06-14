/**
 * Image loading utility for the puzzle engine.
 *
 * Provides a Promise-based wrapper around HTMLImageElement construction
 * that ensures the image is fully decoded before resolving. This
 * guarantees that downstream consumers (e.g., the headbreaker Canvas)
 * receive a ready-to-use image element, avoiding blank-piece bugs
 * caused by constructing a canvas with an unloaded image.
 */

/**
 * Load an image from a URL and resolve once the browser has fully
 * decoded it. Rejects if the image fails to load (network error,
 * invalid source, decode failure).
 *
 * @param src - The image URL (absolute, relative, or Vite asset import).
 * @returns A Promise resolving to the loaded HTMLImageElement.
 * @throws {Error} If the image fails to load or decode.
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}
