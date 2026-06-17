import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, cleanup } from '@testing-library/react';

/**
 * Integration tests for the PuzzleCanvas React wrapper component.
 *
 * All external dependencies (headbreaker, loadImage, sampleImage,
 * engineOptions) are mocked to isolate the component logic and avoid
 * headbreaker/Konva DOM side-effects in jsdom.
 */

// --- Mock canvas instance returned by headbreaker.Canvas constructor ---
const mockCanvas = {
  adjustImagesToPuzzleHeight: vi.fn(),
  autogenerate: vi.fn(),
  shuffle: vi.fn(),
  draw: vi.fn(),
  clear: vi.fn(),
  redraw: vi.fn(),
  onConnect: vi.fn(),
  onValid: vi.fn(),
  attachSolvedValidator: vi.fn(),
};

// Use a class so `new Canvas(...)` works correctly in vitest
const MockCanvasClass = vi.fn(function (this: typeof mockCanvas) {
  Object.assign(this, mockCanvas);
}) as unknown as typeof import('headbreaker').Canvas;

vi.mock('headbreaker', () => ({
  Canvas: MockCanvasClass,
}));

// --- Mock loadImage to return a controllable promise ---
let loadImageResolve: (img: HTMLImageElement) => void;
let loadImageReject: (err: Error) => void;

const mockLoadImage = vi.fn(
  () =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      loadImageResolve = resolve;
      loadImageReject = reject;
    }),
);

vi.mock('../../src/engine/loadImage', () => ({
  loadImage: (...args: unknown[]) =>
    mockLoadImage(...(args as Parameters<typeof mockLoadImage>)),
}));

vi.mock('../../src/engine/sampleImage', () => ({
  sampleUrl: 'test-sample.jpg',
}));

const mockOptions = {
  width: 800,
  height: 600,
  pieceSize: { x: 200, y: 200 },
  proximity: 40,
  borderFill: 20,
  strokeWidth: 1.5,
  strokeColor: '#5b636a',
  lineSoftness: 0.16,
  image: {} as HTMLImageElement,
  fixed: true,
  outline: {},
  painter: {},
};

const mockAutoOptions = {
  horizontalPiecesCount: 4,
  verticalPiecesCount: 3,
  insertsGenerator: vi.fn(),
};

vi.mock('../../src/engine/engineOptions', () => ({
  computeEngineOptions: vi.fn(() => mockOptions),
  computeAutogenerateOptions: vi.fn(() => mockAutoOptions),
}));

// --- Helper to create a mock image with natural dimensions ---
function createMockImage(
  naturalWidth: number,
  naturalHeight: number,
): HTMLImageElement {
  const img = new Image();
  Object.defineProperty(img, 'naturalWidth', { value: naturalWidth });
  Object.defineProperty(img, 'naturalHeight', { value: naturalHeight });
  return img;
}

// --- Mock clientWidth/clientHeight on HTMLDivElement ---
let clientWidthValue = 800;
let clientHeightValue = 600;

const clientWidthDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'clientWidth',
);
const clientHeightDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'clientHeight',
);

beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get: () => clientWidthValue,
  });
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get: () => clientHeightValue,
  });

  // Default: no reduced motion
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  clientWidthValue = 800;
  clientHeightValue = 600;

  // Restore original descriptors
  if (clientWidthDescriptor) {
    Object.defineProperty(
      HTMLElement.prototype,
      'clientWidth',
      clientWidthDescriptor,
    );
  }
  if (clientHeightDescriptor) {
    Object.defineProperty(
      HTMLElement.prototype,
      'clientHeight',
      clientHeightDescriptor,
    );
  }
});

// Lazy import so mocks are established first
async function importComponent() {
  const mod = await import('../../src/engine/puzzleCanvas');
  return mod.default;
}

describe('PuzzleCanvas', () => {
  it('shows "Loading puzzle..." initially with aria-live', async () => {
    const PuzzleCanvas = await importComponent();
    render(<PuzzleCanvas />);

    const loading = screen.getByText('Loading puzzle...');
    expect(loading).toBeInTheDocument();
    expect(loading).toHaveAttribute('aria-live', 'polite');
  });

  it('constructs Canvas after image loads', async () => {
    const { Canvas } = await import('headbreaker');
    const PuzzleCanvas = await importComponent();
    render(<PuzzleCanvas />);

    await act(async () => {
      loadImageResolve(createMockImage(1600, 1200));
    });

    expect(Canvas).toHaveBeenCalledTimes(1);
  });

  it('calls engine methods in correct order', async () => {
    const PuzzleCanvas = await importComponent();
    render(<PuzzleCanvas />);

    await act(async () => {
      loadImageResolve(createMockImage(1600, 1200));
    });

    const adjustOrder = mockCanvas.adjustImagesToPuzzleHeight.mock.invocationCallOrder[0]!;
    const autogenOrder = mockCanvas.autogenerate.mock.invocationCallOrder[0]!;
    const shuffleOrder = mockCanvas.shuffle.mock.invocationCallOrder[0]!;
    const drawOrder = mockCanvas.draw.mock.invocationCallOrder[0]!;

    expect(adjustOrder).toBeLessThan(autogenOrder);
    expect(autogenOrder).toBeLessThan(shuffleOrder);
    expect(shuffleOrder).toBeLessThan(drawOrder);
  });

  it('calls autogenerate with 4×3 grid options', async () => {
    const PuzzleCanvas = await importComponent();
    render(<PuzzleCanvas />);

    await act(async () => {
      loadImageResolve(createMockImage(1600, 1200));
    });

    expect(mockCanvas.autogenerate).toHaveBeenCalledWith(mockAutoOptions);
  });

  it('calls shuffle with 0.7', async () => {
    const PuzzleCanvas = await importComponent();
    render(<PuzzleCanvas />);

    await act(async () => {
      loadImageResolve(createMockImage(1600, 1200));
    });

    expect(mockCanvas.shuffle).toHaveBeenCalledWith(0.7);
  });

  it('wires onConnect callback', async () => {
    const PuzzleCanvas = await importComponent();
    render(<PuzzleCanvas />);

    await act(async () => {
      loadImageResolve(createMockImage(1600, 1200));
    });

    expect(mockCanvas.onConnect).toHaveBeenCalledTimes(1);
    expect(typeof mockCanvas.onConnect.mock.calls[0]![0]).toBe('function');
  });

  it('calls attachSolvedValidator', async () => {
    const PuzzleCanvas = await importComponent();
    render(<PuzzleCanvas />);

    await act(async () => {
      loadImageResolve(createMockImage(1600, 1200));
    });

    expect(mockCanvas.attachSolvedValidator).toHaveBeenCalledTimes(1);
  });

  it('wires onValid callback', async () => {
    const PuzzleCanvas = await importComponent();
    render(<PuzzleCanvas />);

    await act(async () => {
      loadImageResolve(createMockImage(1600, 1200));
    });

    expect(mockCanvas.onValid).toHaveBeenCalledTimes(1);
    expect(typeof mockCanvas.onValid.mock.calls[0]![0]).toBe('function');
  });

  it('calls canvas.clear() on unmount', async () => {
    const PuzzleCanvas = await importComponent();
    const { unmount } = render(<PuzzleCanvas />);

    await act(async () => {
      loadImageResolve(createMockImage(1600, 1200));
    });

    unmount();
    expect(mockCanvas.clear).toHaveBeenCalled();
  });

  it('shows error alert if image load fails', async () => {
    const PuzzleCanvas = await importComponent();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<PuzzleCanvas />);

    await act(async () => {
      loadImageReject(new Error('Network error'));
    });

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Failed to load puzzle');
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('renders mount div with correct attributes', async () => {
    const PuzzleCanvas = await importComponent();
    render(<PuzzleCanvas />);

    const mount = screen.getByTestId('puzzle-canvas');
    expect(mount).toHaveClass('h-full', 'w-full');
    expect(mount.style.position).toBe('relative');
    expect(mount).toHaveAttribute('id');
  });

  it('mount div is empty after unmount (no orphan nodes)', async () => {
    const PuzzleCanvas = await importComponent();
    const { unmount, container } = render(<PuzzleCanvas />);

    const mount = screen.getByTestId('puzzle-canvas');

    // Simulate Konva adding a child node
    const konvaDiv = document.createElement('div');
    konvaDiv.className = 'konvajs-content';
    mount.appendChild(konvaDiv);

    await act(async () => {
      loadImageResolve(createMockImage(1600, 1200));
    });

    unmount();

    // The mount div itself is removed from DOM by React unmount,
    // but verify the cleanup ran (clear was called)
    expect(mockCanvas.clear).toHaveBeenCalled();
    // Container should be empty after unmount
    expect(container.innerHTML).toBe('');
  });

  it('shows error when container has zero dimensions', async () => {
    const PuzzleCanvas = await importComponent();

    clientWidthValue = 0;
    clientHeightValue = 0;

    render(<PuzzleCanvas />);

    await act(async () => {
      loadImageResolve(createMockImage(1600, 1200));
    });

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Unable to measure puzzle container');
  });

  it('letterbox: landscape image into portrait container', async () => {
    const { computeEngineOptions } = await import(
      '../../src/engine/engineOptions'
    );
    const PuzzleCanvas = await importComponent();

    // Container is portrait: 400×800
    clientWidthValue = 400;
    clientHeightValue = 800;

    render(<PuzzleCanvas />);

    // Image is landscape: 1600×900 (aspect ≈ 1.78)
    await act(async () => {
      loadImageResolve(createMockImage(1600, 900));
    });

    // imgAspect (1.78) > containerAspect (0.5) → constrain by width
    // boardW = 400, boardH = 400 / 1.78 ≈ 225
    const call = vi.mocked(computeEngineOptions).mock.calls[0]![0];
    expect(call.boardW).toBe(400);
    expect(call.boardH).toBeCloseTo(400 / (1600 / 900), 5);
  });

  it('letterbox: portrait image into landscape container', async () => {
    const { computeEngineOptions } = await import(
      '../../src/engine/engineOptions'
    );
    const PuzzleCanvas = await importComponent();

    // Container is landscape: 800×400
    clientWidthValue = 800;
    clientHeightValue = 400;

    render(<PuzzleCanvas />);

    // Image is portrait: 900×1600 (aspect ≈ 0.5625)
    await act(async () => {
      loadImageResolve(createMockImage(900, 1600));
    });

    // imgAspect (0.5625) < containerAspect (2) → constrain by height
    // boardH = 400, boardW = 400 * 0.5625 = 225
    const call = vi.mocked(computeEngineOptions).mock.calls[0]![0];
    expect(call.boardH).toBe(400);
    expect(call.boardW).toBeCloseTo(400 * (900 / 1600), 5);
  });
});
