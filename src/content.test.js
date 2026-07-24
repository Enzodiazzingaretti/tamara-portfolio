import { describe, it, expect } from "vitest";
import { DEFAULTS, mergeContent, loadContent } from "./content";

describe("DEFAULTS", () => {
  it("tiene las claves de nivel raíz", () => {
    expect(Object.keys(DEFAULTS).sort()).toEqual(
      ["about", "categories", "hero", "keywords", "process", "sections", "services", "site"]
    );
  });
  it("todas las secciones arrancan encendidas", () => {
    expect(DEFAULTS.sections).toEqual({
      portfolio: true, services: true, process: true, about: true, contact: true,
    });
  });
});

describe("mergeContent", () => {
  it("devuelve defaults si incoming es null", () => {
    expect(mergeContent(DEFAULTS, null)).toEqual(DEFAULTS);
  });
  it("pisa strings escalares", () => {
    const out = mergeContent(DEFAULTS, { site: { name: "Nueva" } });
    expect(out.site.name).toBe("Nueva");
    expect(out.site.role).toBe(DEFAULTS.site.role); // no tocado
  });
  it("reemplaza arrays enteros (permite borrar/reordenar)", () => {
    const out = mergeContent(DEFAULTS, { services: [{ id: "x", title: "Solo uno", description: "d", icon: "Sparkle", enabled: true }] });
    expect(out.services).toHaveLength(1);
    expect(out.services[0].title).toBe("Solo uno");
  });
});

describe("loadContent", () => {
  it("mergea el json remoto sobre defaults", async () => {
    const fake = async () => ({ ok: true, json: async () => ({ site: { name: "Remota" } }) });
    const out = await loadContent(fake);
    expect(out.site.name).toBe("Remota");
    expect(out.categories).toHaveLength(4);
  });
  it("cae a defaults si el fetch tira", async () => {
    const fake = async () => { throw new Error("network"); };
    const out = await loadContent(fake);
    expect(out).toEqual(DEFAULTS);
  });
  it("cae a defaults si el response no es ok", async () => {
    const fake = async () => ({ ok: false });
    const out = await loadContent(fake);
    expect(out).toEqual(DEFAULTS);
  });
});
