import { render, screen, waitFor } from "@testing-library/react";
import { ContentProvider, useContent } from "./ContentContext";
import { DEFAULTS } from "./content";

function Probe() {
  const c = useContent();
  return <div>{c.site.name}</div>;
}

describe("ContentProvider", () => {
  it("arranca con defaults y luego mergea el fetch", async () => {
    const original = global.fetch;
    global.fetch = async () => ({ ok: true, json: async () => ({ site: { name: "Desde JSON" } }) });
    render(<ContentProvider><Probe /></ContentProvider>);
    expect(screen.getByText(DEFAULTS.site.name)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Desde JSON")).toBeInTheDocument());
    global.fetch = original;
  });
});
