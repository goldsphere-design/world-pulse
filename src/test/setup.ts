import '@testing-library/jest-dom/vitest';

// Polyfill ResizeObserver for jsdom tests (used by react-use-measure)
import ResizeObserver from 'resize-observer-polyfill';

/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
// @ts-expect-error Attach to global for test environment
(global as any).ResizeObserver = ResizeObserver;

// Optional: polyfill matchMedia if needed by components
if (!(global as any).matchMedia) {
  (global as any).matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
