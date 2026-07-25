import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ContentProvider, useContent } from "./ContentContext";
import { DEFAULTS } from "./content";

function Probe() {
  const c = useContent();
  return <div>{c.site.name}</div>;
}

describe("ContentProvider", () => {
  it("arranca con defaults y luego mergea el fetch", async () => {
    const original = globalThis.fetch;
    globalThis.fetch = async () => ({ ok: true, json: async () => ({ site: { name: "Desde JSON" } }) });
    render(<ContentProvider><Probe /></ContentProvider>);
    expect(screen.getByText(DEFAULTS.site.name)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Desde JSON")).toBeInTheDocument());
    globalThis.fetch = original;
  });
});
