// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

// api/ is CommonJS (see api/package.json), and nested `require()` calls
// inside CJS modules are not intercepted by vi.mock() in this vitest setup
// (verified: mocking only rewrites ESM import graphs, not runtime require()
// calls made by already-CJS code). Node's require cache is shared by
// resolved path though, so mutating the cached _lib.js export object here
// has the same effect as mocking it, as long as this happens before
// content.js does its own require('./_lib.js') destructure below.
const lib = require("./_lib.js");
lib.requireAuth = () => true;
lib.isAllowedFile = (f) => f === "content.json";
lib.ghRead = vi.fn(async () => ({ content: Buffer.from('{"site":{"name":"X"}}').toString("base64") }));
lib.ghWrite = vi.fn(async () => ({ ok: true }));

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
