import { describe, it, expect } from "vitest";
import { move, removeAt } from "./ReorderableList";

describe("move/removeAt", () => {
  it("move sube un item", () => { expect(move(["a", "b", "c"], 2, 1)).toEqual(["a", "c", "b"]); });
  it("move clampa fuera de rango", () => { expect(move(["a", "b"], 0, -1)).toEqual(["a", "b"]); });
  it("removeAt saca por índice", () => { expect(removeAt(["a", "b", "c"], 1)).toEqual(["a", "c"]); });
});
