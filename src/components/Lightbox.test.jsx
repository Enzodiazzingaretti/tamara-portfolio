import { render, screen, fireEvent } from "@testing-library/react";
import Lightbox from "./Lightbox";

describe("Lightbox", () => {
  it("muestra la imagen actual y cierra con Esc", () => {
    const onClose = vi.fn();
    render(<Lightbox images={["/a.webp", "/b.webp"]} index={0} onClose={onClose} onIndexChange={() => {}} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("navega con las flechas", () => {
    const onIndexChange = vi.fn();
    render(<Lightbox images={["/a.webp", "/b.webp"]} index={0} onClose={() => {}} onIndexChange={onIndexChange} />);
    fireEvent.keyDown(document, { key: "ArrowRight" });
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });
});
