import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PortfolioPanel from "./PortfolioPanel";

function makeDraft() {
  return {
    categories: [
      {
        id: "tatuajes", title: "Tatuajes", subtitle: "Ilustración", description: "", enabled: true,
        cover: "/trabajos/tatuajes/sirena-01.webp",
        projects: [
          { id: "sirena", title: "Sirena", enabled: true, cover: "/trabajos/tatuajes/sirena-01.webp",
            media: ["/trabajos/tatuajes/sirena-01.webp", "/trabajos/tatuajes/sirena-02.webp"] },
        ],
      },
    ],
  };
}

describe("PortfolioPanel (modelo de proyectos)", () => {
  it("renderiza los proyectos de la categoría con su nombre interno", () => {
    render(<PortfolioPanel draft={makeDraft()} update={vi.fn()} />);
    expect(screen.getByText("Proyectos")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Sirena")).toBeInTheDocument();
  });

  it("agregar un proyecto lo appendea con enabled y media vacía, y conserva la portada", async () => {
    const update = vi.fn();
    render(<PortfolioPanel draft={makeDraft()} update={update} />);

    await userEvent.click(screen.getByText("proyecto"));

    expect(update).toHaveBeenCalledTimes(1);
    const [path, categories] = update.mock.calls[0];
    expect(path).toEqual(["categories"]);
    const cat = categories[0];
    expect(cat.projects).toHaveLength(2);
    expect(cat.projects[1]).toMatchObject({ enabled: true, media: [], cover: "" });
    // La portada de la categoría sigue siendo la del primer proyecto.
    expect(cat.cover).toBe("/trabajos/tatuajes/sirena-01.webp");
  });
});
