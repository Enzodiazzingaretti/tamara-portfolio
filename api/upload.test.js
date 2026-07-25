// @vitest-environment node
import { describe, it, expect, vi, afterAll } from "vitest";

// api/ is CommonJS (see api/package.json), and vi.mock() does not intercept
// require() calls made from already-CJS modules in this setup (see the note in
// content.test.js). Node's require cache is shared by resolved path, so we
// mutate the cached _lib.js export object BEFORE requiring upload.js — that way
// upload.js captures these doubles when it destructures require('./_lib.js').
const lib = require("./_lib.js");
const originals = { requireAuth: lib.requireAuth, ghWrite: lib.ghWrite };
lib.requireAuth = () => true;
lib.ghWrite = vi.fn(async () => ({ ok: true }));
// isAllowedImagePath is left real: upload.js builds a path the real validator
// already accepts, so a double here would be a no-op (same idea as content.test).

afterAll(() => {
  lib.requireAuth = originals.requireAuth;
  lib.ghWrite = originals.ghWrite;
});

const handler = require("./upload.js");

function mockRes() {
  return {
    _status: 0, _json: null, _headers: {},
    setHeader(k, v) { this._headers[k] = v; },
    status(c) { this._status = c; return this; },
    json(o) { this._json = o; return this; },
  };
}

// RIFF????WEBP???? — minimal valid webp magic (12+ bytes, RIFF at 0, WEBP at 8).
const webpB64 = Buffer.concat([
  Buffer.from("RIFF"), Buffer.alloc(4), Buffer.from("WEBP"), Buffer.alloc(4),
]).toString("base64");

describe("api/upload", () => {
  it("rechaza slot inválido (traversal)", async () => {
    const res = mockRes();
    await handler({ method: "POST", body: { slot: "../x", data: webpB64 } }, res);
    expect(res._status).toBe(400);
    expect(lib.ghWrite).not.toHaveBeenCalled();
  });

  it("rechaza data que no es webp", async () => {
    const res = mockRes();
    await handler({ method: "POST", body: { slot: "hero", data: Buffer.from("no").toString("base64") } }, res);
    expect(res._status).toBe(400);
    expect(lib.ghWrite).not.toHaveBeenCalled();
  });

  it("acepta webp válido y devuelve path (repo) y url (pública)", async () => {
    lib.ghWrite.mockClear();
    const res = mockRes();
    await handler({ method: "POST", body: { slot: "cat-tatuajes", data: webpB64 } }, res);
    expect(res._status).toBe(200);
    expect(res._json.path).toMatch(/^public\/trabajos\/cat-tatuajes-\d+\.webp$/);
    expect(res._json.url).toMatch(/^\/trabajos\/cat-tatuajes-\d+\.webp$/);
    expect(lib.ghWrite).toHaveBeenCalledOnce();
  });
});
