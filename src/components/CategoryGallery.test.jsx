import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CategoryGallery from "./CategoryGallery";

const cat = {
  id: "tatuajes",
  title: "Tatuajes",
  subtitle: "Ilustración",
  description: "Trabajos en piel.",
  gallery: ["/a.webp", "/b.webp", "/c.webp"],
};

describe("CategoryGallery", () => {
  it("muestra el título, la descripción y todas las obras en grid", () => {
    render(<CategoryGallery category={cat} onClose={() => {}} />);
    expect(screen.getByRole("dialog", { name: /Galería de Tatuajes/ })).toBeInTheDocument();
    expect(screen.getByText("Trabajos en piel.")).toBeInTheDocument();
    // 3 imágenes del grid (sin contar el lightbox, que aún no está abierto)
    expect(screen.getAllByRole("img")).toHaveLength(3);
  });

  it("abre el lightbox al tocar una obra", () => {
    render(<CategoryGallery category={cat} onClose={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Tatuajes 1" }));
    // el lightbox monta su propio diálogo de galería
    expect(screen.getByRole("dialog", { name: "Galería" })).toBeInTheDocument();
  });

  it("cierra con Esc cuando el lightbox no está abierto", () => {
    const onClose = vi.fn();
    render(<CategoryGallery category={cat} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});
