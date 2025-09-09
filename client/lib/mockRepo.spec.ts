import { describe, it, expect, beforeAll } from "vitest";
import { repo, seedOnce } from "./mockRepo";

describe("mockRepo", () => {
  beforeAll(() => {
    localStorage.clear();
    seedOnce();
  });
  it("saves and retrieves strategy", () => {
    const id = repo.saveStrategy({ title: "Test", nodes: [], edges: [] });
    const s = repo.getStrategy(id)!;
    expect(s.title).toBe("Test");
  });
});
