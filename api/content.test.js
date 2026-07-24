// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterAll } from "vitest";

// api/ is CommonJS (see api/package.json), and nested `require()` calls
// inside CJS modules are not intercepted by vi.mock() in this vitest setup
// (verified: mocking only rewrites ESM import graphs, not runtime require()
// calls made by already-CJS code). Node's require cache is shared by
// resolved path though, so mutating the cached _lib.js export object here
// has the same effect as mocking it, as long as this happens before
// content.js does its own require('./_lib.js') destructure below.
const lib = require("./_lib.js");
const originals = {
  requireAuth: lib.requireAuth,
  ghRead: lib.ghRead,
  ghWrite: lib.ghWrite,
};
lib.requireAuth = () => true;
// isAllowedFile is intentionally left untouched: content.js always calls it
// with the hardcoded "content.json" constant, and the real implementation
// already returns true for it, so a test-double override here is a no-op.
lib.ghRead = vi.fn(async () => ({ content: Buffer.from('{"site":{"name":"X"}}').toString("base64") }));
lib.ghWrite = vi.fn(async () => ({ ok: true }));

afterAll(() => {
  lib.requireAuth = originals.requireAuth;
  lib.ghRead = originals.ghRead;
  lib.ghWrite = originals.ghWrite;
});

const handler = require("./content.js");

function mockRes() {
  return {
    _status: 0, _json: null, _headers: {},
    setHeader(k, v) { this._headers[k] = v; },
    status(c) { this._status = c; return this; },
    json(o) { this._json = o; return this; },
  };
}

beforeEach(() => {
  lib.ghRead.mockClear();
  lib.ghWrite.mockClear();
});

describe("api/content PUT", () => {
  it("rechaza data que no es objeto", async () => {
    const res = mockRes();
    await handler({ method: "PUT", body: { data: "no-objeto" } }, res);
    expect(res._status).toBe(400);
  });
  it("acepta data objeto", async () => {
    const res = mockRes();
    await handler({ method: "PUT", body: { data: { site: { name: "Y" } } } }, res);
    expect(res._status).toBe(200);
  });
});
