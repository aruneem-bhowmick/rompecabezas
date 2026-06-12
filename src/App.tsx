import type { ReactElement } from 'react';

/**
 * Root application component.
 *
 * Renders a minimal placeholder that serves as a visual proof-of-life
 * for the application scaffold. Replaced with full layout and routing
 * as the project evolves.
 *
 * @returns The top-level React element for the application.
 */
export default function App(): ReactElement {
  return (
    <div data-testid="app-root" className="min-h-screen bg-paper text-ink">
      Rompecabezas
    </div>
  );
}
