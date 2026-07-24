import "@testing-library/jest-dom/vitest";

// jsdom no implementa IntersectionObserver; framer-motion lo usa para whileInView.
if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
}
