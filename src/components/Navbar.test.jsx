import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar";
import { ContentProvider } from "../ContentContext";
import { DEFAULTS, mergeContent } from "../content";

function renderWith(overrides) {
  const initial = mergeContent(DEFAULTS, overrides);
  return render(<ContentProvider initial={initial}><Navbar /></ContentProvider>);
}

describe("Navbar data-driven", () => {
  it("muestra todos los links con las secciones activas", () => {
    renderWith({});
    expect(screen.getAllByRole("link", { name: "Proceso" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Trabajos" }).length).toBeGreaterThan(0);
  });

  it("oculta el link de una sección apagada", () => {
    renderWith({ sections: { ...DEFAULTS.sections, process: false } });
    expect(screen.queryByRole("link", { name: "Proceso" })).not.toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Trabajos" }).length).toBeGreaterThan(0);
  });
});
