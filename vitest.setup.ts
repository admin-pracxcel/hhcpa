import "@testing-library/jest-dom/vitest";

/**
 * jsdom implements no media queries at all, so `window.matchMedia` is simply
 * absent and any component that asks about `prefers-reduced-motion` throws on
 * mount. `CareAreasSection` does, to decide whether to run its rAF transport.
 *
 * The stub answers "no" to everything, which is the default a browser gives a
 * reader who has expressed no preference — so components under test take their
 * normal path rather than their reduced one. A test that wants the reduced path
 * should override this for itself.
 */
if (typeof window !== "undefined" && window.matchMedia === undefined) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
