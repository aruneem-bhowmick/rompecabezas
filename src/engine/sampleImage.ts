/**
 * Sample image asset URL for development and testing.
 *
 * Re-exports the bundled sample JPEG image as a resolved URL string.
 * Vite transforms the static import into a hashed asset URL at build
 * time, ensuring proper cache-busting and asset fingerprinting.
 *
 * This module provides a clean import path for consumers that need
 * the sample puzzle image without coupling to the raw asset path.
 */
import sampleUrl from '../assets/sample.jpg';

export { sampleUrl };
