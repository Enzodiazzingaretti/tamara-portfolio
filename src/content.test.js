import { describe, it, expect } from "vitest";
import { DEFAULTS, mergeContent } from "./content";

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
