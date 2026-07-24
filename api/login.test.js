// @vitest-environment node
import { describe, it, expect, afterAll } from "vitest";

// api/ is CommonJS (see api/package.json), and nested `require()` calls
// inside CJS modules are not intercepted by vi.mock() in this vitest setup.
// Node's require cache is shared by resolved path though, so mutating the
// cached _lib.js export object here has the same effect as mocking it, as
// long as this happens before login.js does its own require('./_lib.js')
// destructure below. Same pattern as api/content.test.js.
const lib = require("./_lib.js");
const originals = {
  isConfigured: lib.isConfigured,
  checkPassword: lib.checkPassword,
  sign: lib.sign,
  sessionCookie: lib.sessionCookie,
};
lib.isConfigured = () => true;
lib.checkPassword = () => true;
lib.sign = () => "tok";
lib.sessionCookie = () => "cookie";

const handler = require("./login.js");

// Restore the shared _lib.js exports so the monkeypatch can't leak into other
// test files if vitest isolation is ever disabled (defense-in-depth).
afterAll(() => {
  Object.assign(lib, originals);
});

function mockRes() {
  return {
    _status: 0, _json: null, _headers: {},
    setHeader(k, v) { this._headers[k] = v; },
    status(c) { this._status = c; return this; },
    json(o) { this._json = o; return this; },
  };
}

function mockReq(ip) {
  return {
    method: "POST",
    headers: { "x-forwarded-for": ip },
    body: { password: "whatever" },
  };
}

describe("api/login rate limiting", () => {
  it("bloquea el 6to intento desde la misma IP con 429", async () => {
    const ip = "10.0.0.1";
    let res;
    for (let i = 0; i < 5; i++) {
      res = mockRes();
      await handler(mockReq(ip), res);
      expect(res._status).toBe(200);
    }
    res = mockRes();
    await handler(mockReq(ip), res);
    expect(res._status).toBe(429);
    expect(res._json).toEqual({ error: "rate_limited" });
  });

  it("permite una IP distinta aunque la anterior esté bloqueada", async () => {
    const ip = "10.0.0.2";
    const res = mockRes();
    await handler(mockReq(ip), res);
    expect(res._status).toBe(200);
  });
});
