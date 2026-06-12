import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite build configuration for the Rompecabezas application.
 *
 * Uses the React plugin for JSX transform and Fast Refresh support
 * during development. No additional plugins are configured at this stage.
 *
 * @see https://vite.dev/config/
 */
export default defineConfig({
  plugins: [react()],
});
