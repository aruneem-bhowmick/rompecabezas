describe('engine imports', () => {
  /**
   * Verifies that the Canvas constructor is importable from the engine
   * barrel and resolves to a callable function, confirming the bundled
   * import path for headbreaker works under Vite.
   */
  it('imports Canvas from headbreaker', async () => {
    const { Canvas } = await import('../../src/engine');
    expect(Canvas).toBeDefined();
    expect(typeof Canvas).toBe('function');
  });

  /**
   * Verifies that the painters namespace is importable and exposes the
   * Konva painter constructor required for canvas-based rendering.
   */
  it('imports painters.Konva from headbreaker', async () => {
    const { painters } = await import('../../src/engine');
    expect(painters).toBeDefined();
    expect(painters.Konva).toBeDefined();
  });

  /**
   * Verifies that the generators namespace is importable and exposes
   * the random insert generator used for varied tab/slot patterns.
   */
  it('imports generators from headbreaker', async () => {
    const { generators } = await import('../../src/engine');
    expect(generators).toBeDefined();
    expect(generators.random).toBeDefined();
  });

  /**
   * Verifies that the outline namespace is importable and exposes the
   * Rounded outline constructor used for classic jigsaw piece shapes.
   */
  it('imports outline from headbreaker', async () => {
    const { outline } = await import('../../src/engine');
    expect(outline).toBeDefined();
    expect(outline.Rounded).toBeDefined();
  });

  /**
   * Verifies that the Konva default export is importable from the
   * engine barrel, confirming the konva package resolves under Vite.
   */
  it('imports Konva', async () => {
    const { Konva } = await import('../../src/engine');
    expect(Konva).toBeDefined();
  });
});
