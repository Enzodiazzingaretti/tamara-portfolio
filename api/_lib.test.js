// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
const lib = require("./_lib.js");

beforeAll(() => { process.env.SESSION_SECRET = "test-secret-para-hmac"; });

describe("isAllowedFile", () => {
  it("permite content.json y nada más", () => {
    expect(lib.isAllowedFile("content.json")).toBe(true);
    expect(lib.isAllowedFile("dates.json")).toBe(false);
    expect(lib.isAllowedFile("../secreto")).toBe(false);
  });
});

describe("isAllowedImagePath", () => {
  it("solo webp en public/trabajos con slot-digits", () => {
    expect(lib.isAllowedImagePath("public/trabajos/tatuajes-123.webp")).toBe(true);
    expect(lib.isAllowedImagePath("public/trabajos/x.png")).toBe(false);
    expect(lib.isAllowedImagePath("public/trabajos/../x-1.webp")).toBe(false);
    expect(lib.isAllowedImagePath("img/x-1.webp")).toBe(false);
  });
});

describe("sign/verify", () => {
  it("round-trip válido", () => {
    const token = lib.sign({ u: "admin", exp: Date.now() + 10000 });
    expect(lib.verify(token)).toMatchObject({ u: "admin" });
  });
  it("rechaza expirado", () => {
    const token = lib.sign({ u: "admin", exp: Date.now() - 1 });
    expect(lib.verify(token)).toBeNull();
  });
  it("rechaza firma adulterada", () => {
    const token = lib.sign({ u: "admin", exp: Date.now() + 10000 });
    expect(lib.verify(token + "x")).toBeNull();
  });
});
