import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../src/App';

vi.mock('../../src/engine/puzzleCanvas', () => ({
  default: () => <div data-testid="puzzle-canvas" />,
}));

/**
 * Smoke tests for the root App component.
 *
 * These assertions verify the application shell renders without
 * errors in the jsdom environment, composes the three-region layout
 * (TopBar, StageArea, ControlBar), and applies the expected design
 * tokens and typography utilities as Tailwind classes.
 *
 * PuzzleCanvas is mocked to avoid loading headbreaker/Konva in jsdom.
 */
describe('App component', () => {
  /**
   * Confirms the App component mounts and displays the wordmark
   * rendered inside the TopBar child component.
   */
  it('renders the application name', () => {
    render(<App />);
    expect(screen.getByText('Rompecabezas')).toBeInTheDocument();
  });

  /**
   * Verifies the root container applies the paper background and ink
   * text color design tokens via Tailwind utilities.
   */
  it('applies design-token utility classes to the root element', () => {
    render(<App />);
    const root = screen.getByTestId('app-root');
    expect(root).toHaveClass('bg-paper');
    expect(root).toHaveClass('text-ink');
  });

  /**
   * Confirms the root container spans the full viewport height to
   * provide a consistent application shell.
   */
  it('fills the viewport height', () => {
    render(<App />);
    const root = screen.getByTestId('app-root');
    expect(root).toHaveClass('min-h-screen');
  });

  /**
   * Verifies the root container uses the Inter body font family
   * as the default typeface for all UI text.
   */
  it('applies the body font family to the root element', () => {
    render(<App />);
    const root = screen.getByTestId('app-root');
    expect(root).toHaveClass('font-body');
  });

  /**
   * Verifies the heading inside TopBar uses the Bricolage Grotesque
   * display font for the application wordmark.
   */
  it('renders the heading with the display font family', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('font-display');
  });

  /**
   * Verifies the timer placeholder inside TopBar uses tabular-nums
   * for consistent numeral widths.
   */
  it('includes a tabular-nums sample element', () => {
    render(<App />);
    const sample = screen.getByTestId('timer-sample');
    expect(sample).toHaveClass('tabular-nums');
    expect(sample).toHaveTextContent('00:00');
  });

  /**
   * Confirms the root element uses a flex column layout to stack
   * the three layout regions vertically.
   */
  it('uses a flex column layout', () => {
    render(<App />);
    const root = screen.getByTestId('app-root');
    expect(root).toHaveClass('flex', 'flex-col');
  });
});
