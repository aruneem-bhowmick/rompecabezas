import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../src/App';

/**
 * Smoke tests for the root App component.
 *
 * These assertions verify the application shell renders without
 * errors in the jsdom environment and applies the expected design
 * tokens as Tailwind utility classes.
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
});
