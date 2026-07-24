// @vitest-environment node
import { describe, it, expect } from "vitest";
const { makeLimiter } = require("./_rate.js");

describe("rate limiter", () => {
  it("bloquea tras 5 intentos en la ventana", () => {
    const limit = makeLimiter(5, 10 * 60 * 1000);
    let now = 1000;
    for (let i = 0; i < 5; i++) expect(limit("1.2.3.4", now)).toBe(true);
    expect(limit("1.2.3.4", now)).toBe(false); // 6to
  });
  it("resetea pasada la ventana", () => {
    const limit = makeLimiter(5, 1000);
    expect(limit("ip", 0)).toBe(true);
    for (let i = 0; i < 4; i++) limit("ip", 0);
    expect(limit("ip", 0)).toBe(false);
    expect(limit("ip", 2000)).toBe(true); // ventana nueva
  });
});
