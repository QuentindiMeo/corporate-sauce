import { describe, expect, it } from "vitest";

// Test de fumée : vérifie que le harnais Vitest tourne. Remplacé par les tests
// du domaine en Phase 1 (action.md §10).
describe("Feature: test harness", () => {
  it("Given the harness, When it runs, Then Vitest executes", () => {
    expect(1 + 1).toBe(2);
  });
});
