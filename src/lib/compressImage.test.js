import { describe, it, expect } from "vitest";
import { pickQuality } from "./compressImage";

describe("pickQuality", () => {
  it("baja la calidad si el tamaño estimado supera el límite", () => {
    const sizeFor = (q) => (q > 0.5 ? 3_000_000 : 1_000_000);
    expect(pickQuality(sizeFor, 2_000_000)).toBeLessThanOrEqual(0.5);
  });
  it("mantiene calidad alta si ya entra", () => {
    const sizeFor = () => 500_000;
    expect(pickQuality(sizeFor, 2_000_000)).toBe(0.82);
  });
});
