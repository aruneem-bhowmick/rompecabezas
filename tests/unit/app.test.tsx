import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../src/App';

/**
 * Smoke tests for the root App component.
 *
 * These assertions verify the application shell renders without
 * errors in the jsdom environment and applies the expected design
 * tokens and typography utilities as Tailwind classes.
 */
describe('App component', () => {
  /**
   * Confirms the App component mounts and displays its root content.
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
   * Verifies the heading uses the Bricolage Grotesque display font
   * for the application wordmark.
   */
  it('renders the heading with the display font family', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('font-display');
  });

  /**
   * Verifies a tabular-nums sample element exists for timer-style
   * numeral rendering.
   */
  it('includes a tabular-nums sample element', () => {
    render(<App />);
    const sample = screen.getByTestId('timer-sample');
    expect(sample).toHaveClass('tabular-nums');
    expect(sample).toHaveTextContent('00:00');
  });
});
