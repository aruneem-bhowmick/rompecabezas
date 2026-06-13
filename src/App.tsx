import type { ReactElement } from 'react';
import TopBar from './ui/TopBar';
import StageArea from './ui/StageArea';
import ControlBar from './ui/ControlBar';

/**
 * Root application component.
 *
 * Composes the three-region layout shell — TopBar, StageArea, and
 * ControlBar — inside a full-height flex column. Design tokens for
 * background, text color, and body font are applied at this root level.
 *
 * @returns The top-level React element for the application.
 */
export default function App(): ReactElement {
  return (
    <div
      data-testid="app-root"
      className="flex min-h-screen flex-col bg-paper font-body text-ink"
    >
      <TopBar />
      <StageArea />
      <ControlBar />
    </div>
  );
}
