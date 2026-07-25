import { describe, it, expect, vi, afterEach } from "vitest";
import { login, getContent } from "./api";

afterEach(() => { vi.restoreAllMocks(); });

describe("admin api", () => {
  it("login tira con el error del server en 401", async () => {
    global.fetch = vi.fn(async () => ({ ok: false, status: 401, json: async () => ({ error: "unauthorized" }) }));
    await expect(login("mala")).rejects.toThrow("unauthorized");
  });
  it("getContent devuelve data", async () => {
    global.fetch = vi.fn(async () => ({ ok: true, json: async () => ({ data: { site: { name: "Z" } } }) }));
    const c = await getContent();
    expect(c.site.name).toBe("Z");
  });
});
