import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

/**
 * Validates that React Testing Library (RTL) is correctly wired into
 * the Vitest environment: components render into the jsdom environment,
 * screen queries resolve elements, and the jest-dom extended matchers
 * (registered via tests/setup.ts) are available without per-file
 * imports.
 */
describe('React Testing Library integration', () => {
  /**
   * Renders a minimal React element and asserts it is present in the
   * jsdom document using RTL's screen queries.
   */
  it('renders a React element into the jsdom environment', () => {
    render(<p>hello</p>);
    expect(screen.getByText('hello')).toBeDefined();
  });

  /**
   * Verifies the jest-dom matcher toBeInTheDocument is available,
   * confirming the setup file registered matchers globally.
   */
  it('exposes jest-dom matchers from the setup file', () => {
    render(<span data-testid="probe">probe</span>);
    expect(screen.getByTestId('probe')).toBeInTheDocument();
  });

  /**
   * Exercises the toHaveClass matcher on a Tailwind utility class to
   * ensure class-based assertions work in the test environment.
   */
  it('supports class-based assertions via jest-dom', () => {
    render(<div data-testid="styled" className="bg-paper text-ink" />);
    const el = screen.getByTestId('styled');
    expect(el).toHaveClass('bg-paper');
    expect(el).toHaveClass('text-ink');
  });
});
