import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TopBar from '../../src/ui/TopBar';
import StageArea from '../../src/ui/StageArea';
import ControlBar from '../../src/ui/ControlBar';
import App from '../../src/App';

/**
 * Component tests for the three-region layout shell.
 *
 * Each region is tested in isolation for its landmark role, key
 * content, and styling. A final group tests the full App composition
 * and captures a snapshot for regression protection.
 *
 * PuzzleCanvas is mocked to avoid loading headbreaker/Konva in jsdom
 * and to keep shell tests focused on layout structure.
 */

vi.mock('../../src/engine/puzzleCanvas', () => ({
  default: () => <div data-testid="puzzle-canvas" />,
}));

describe('TopBar', () => {
  it('renders as a header landmark', () => {
    render(<TopBar />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('displays the full wordmark', () => {
    render(<TopBar />);
    expect(screen.getByText('Rompecabezas')).toBeInTheDocument();
  });

  it('uses responsive classes to toggle between full and short wordmark', () => {
    render(<TopBar />);
    const fullSpan = screen.getByText('Rompecabezas');
    const shortSpan = screen.getByText('Rompe');
    // Full wordmark hidden by default, shown at sm+
    expect(fullSpan).toHaveClass('hidden');
    expect(fullSpan).toHaveClass('sm:inline');
    // Short wordmark shown by default, hidden at sm+
    expect(shortSpan).toHaveClass('inline');
    expect(shortSpan).toHaveClass('sm:hidden');
  });

  it('renders the wordmark with the display font', () => {
    render(<TopBar />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('font-display');
  });

  it('renders the timer placeholder with tabular-nums', () => {
    render(<TopBar />);
    const timer = screen.getByTestId('timer-sample');
    expect(timer).toHaveClass('tabular-nums');
    expect(timer).toHaveTextContent('00:00');
  });

  it('applies the marigold color to the timer', () => {
    render(<TopBar />);
    const timer = screen.getByTestId('timer-sample');
    expect(timer).toHaveClass('text-marigold');
  });

  it('has a bottom border using the line token', () => {
    render(<TopBar />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('border-b', 'border-line');
  });
});

describe('StageArea', () => {
  it('renders as a main landmark', () => {
    render(<StageArea />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the PuzzleCanvas component', () => {
    render(<StageArea />);
    expect(screen.getByTestId('puzzle-canvas')).toBeInTheDocument();
  });

  it('applies the felt background', () => {
    render(<StageArea />);
    const main = screen.getByRole('main');
    expect(main).toHaveClass('bg-felt');
  });

  it('fills remaining vertical space', () => {
    render(<StageArea />);
    const main = screen.getByRole('main');
    expect(main).toHaveClass('flex-1');
  });

  it('applies an inset box-shadow for the recessed tray', () => {
    render(<StageArea />);
    const main = screen.getByRole('main');
    expect(main.style.boxShadow).toBe('inset 0 2px 12px rgba(0,0,0,0.3)');
  });
});

describe('ControlBar', () => {
  it('renders as a footer landmark', () => {
    render(<ControlBar />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders all five action buttons', () => {
    render(<ControlBar />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5);
    expect(buttons.map((b) => b.textContent)).toEqual([
      'Shuffle',
      'Hint',
      'Sound',
      'Reset',
      'New image',
    ]);
  });

  it('disables all buttons', () => {
    render(<ControlBar />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });

  it('styles buttons with rounded-card and cursor-not-allowed', () => {
    render(<ControlBar />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveClass('rounded-card', 'opacity-60', 'cursor-not-allowed');
    });
  });

  it('displays the progress placeholder', () => {
    render(<ControlBar />);
    expect(screen.getByText('0 / 0 connected')).toBeInTheDocument();
  });
});

describe('App composition', () => {
  it('renders all three landmark regions', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
