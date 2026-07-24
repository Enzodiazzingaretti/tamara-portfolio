import { render, screen } from "@testing-library/react";
import App from "./App";
import { ContentProvider } from "./ContentContext";
import { DEFAULTS, mergeContent } from "./content";

function renderWith(overrides) {
  const initial = mergeContent(DEFAULTS, overrides);
  return render(<ContentProvider initial={initial}><App /></ContentProvider>);
}

describe("App secciones condicionales", () => {
  it("oculta Proceso si sections.process es false", () => {
    global.fetch = async () => ({ ok: false }); // que no pise el initial
    renderWith({ sections: { ...DEFAULTS.sections, process: false } });
    expect(screen.queryByText("Mi proceso")).not.toBeInTheDocument();
  });
});
