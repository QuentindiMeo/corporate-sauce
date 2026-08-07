import { describe, expect, it } from "vitest";

import { groupByMonth, groupByTheme } from "@domain/post-collection";
import { publicationInstant } from "@domain/publication-time";
import { aPost } from "../../helpers/post-factory";

describe("Feature: grouping posts by theme", () => {
  it("Given posts across categories, When they are grouped, Then rows follow the canonical category order", () => {
    const rows = groupByTheme([
      aPost({ id: "a", category: "UI" }),
      aPost({ id: "b", category: "PERF" }),
      aPost({ id: "c", category: "A11Y" }),
    ]);

    expect(rows.map((r) => r.category)).toEqual(["PERF", "A11Y", "UI"]);
  });

  it("Given a category with no post, When posts are grouped, Then that category is omitted", () => {
    const rows = groupByTheme([aPost({ category: "DX" })]);
    expect(rows).toHaveLength(1);
    expect(rows[0].category).toBe("DX");
  });

  it("Given posts in the same category, When they are grouped, Then they are sorted by order then id", () => {
    const rows = groupByTheme([
      aPost({ id: "z", category: "PERF", order: 2 }),
      aPost({ id: "y", category: "PERF", order: 1 }),
      aPost({ id: "x", category: "PERF", order: 1 }),
    ]);

    expect(rows[0].posts.map((p) => p.id)).toEqual(["x", "y", "z"]);
  });

  it("Given no posts, When they are grouped, Then the result is empty", () => {
    expect(groupByTheme([])).toEqual([]);
  });

  it("Given a source array, When it is grouped, Then the source array is not mutated", () => {
    const source = [aPost({ category: "UI" }), aPost({ category: "PERF" })];
    const copy = [...source];
    groupByTheme(source);
    expect(source).toEqual(copy);
  });
});

// ? Raccourci : un post daté du jour donné (minuit UTC, comme le coerce Zod).
const onDay = (id: string, day: string) => aPost({ id, publishedAt: new Date(`${day}T00:00:00Z`) });

describe("Feature: grouping posts by month", () => {
  it("Given posts across months, When they are grouped, Then months run from the most recent to the oldest", () => {
    const rows = groupByMonth([onDay("a", "2026-06-10"), onDay("b", "2026-08-04"), onDay("c", "2026-07-21")]);

    expect(rows.map((r) => r.monthKey)).toEqual(["2026-08", "2026-07", "2026-06"]);
  });

  it("Given posts of the same month, When they are grouped, Then they share one row", () => {
    const rows = groupByMonth([onDay("a", "2026-08-01"), onDay("b", "2026-08-28")]);

    expect(rows).toHaveLength(1);
    expect(rows[0].posts.map((p) => p.id)).toEqual(["b", "a"]);
  });

  it("Given posts within a month, When they are grouped, Then the most recent comes first, ties broken by id", () => {
    const rows = groupByMonth([onDay("z", "2026-08-04"), onDay("m", "2026-08-25"), onDay("a", "2026-08-04")]);

    expect(rows[0].posts.map((p) => p.id)).toEqual(["m", "a", "z"]);
  });

  it("Given a gap between two months, When posts are grouped, Then no empty month is invented", () => {
    const rows = groupByMonth([onDay("a", "2026-03-15"), onDay("b", "2026-01-05")]);

    expect(rows.map((r) => r.monthKey)).toEqual(["2026-03", "2026-01"]);
  });

  it("Given the turn of a year, When posts are grouped, Then months are ordered chronologically, not by number", () => {
    const rows = groupByMonth([onDay("a", "2026-01-08"), onDay("b", "2025-12-02")]);

    expect(rows.map((r) => r.monthKey)).toEqual(["2026-01", "2025-12"]);
  });

  it("Given a date at UTC midnight, When it is grouped, Then the local timezone does not shift it to the previous month", () => {
    // ! Régression : `getMonth()` (local) ferait tomber le 1er août minuit UTC en juillet sur tout fuseau négatif.
    // ! La clé et le repère de mois doivent rester en UTC.
    const rows = groupByMonth([onDay("a", "2026-08-01")]);

    expect(rows[0].monthKey).toBe("2026-08");
    expect(rows[0].month.toISOString()).toBe("2026-08-01T00:00:00.000Z");
  });

  it("Given no posts, When they are grouped, Then the result is empty", () => {
    expect(groupByMonth([])).toEqual([]);
  });

  it("Given a source array, When it is grouped, Then the source array is not mutated", () => {
    const source = [onDay("a", "2026-01-05"), onDay("b", "2026-03-15")];
    const copy = [...source];
    groupByMonth(source);
    expect(source).toEqual(copy);
  });

  it("Given a post published on the 1st at 11 h Paris, When it is grouped, Then it stays in its own month", () => {
    // ! Invariant à protéger : `monthKey` est le mois UTC de l'instant. Il coïncide avec le
    // ! mois parisien PARCE QUE 11 h Paris tombe à 09:00Z ou 10:00Z — jamais la veille.
    // ! Une parution à 00 h 30 Paris (= 22:30Z la veille) casserait cet alignement.
    const premier = groupByMonth([aPost({ id: "a", publishedAt: publicationInstant("2026-08-01") })]);
    expect(premier[0].monthKey).toBe("2026-08");

    const dernier = groupByMonth([aPost({ id: "b", publishedAt: publicationInstant("2026-08-31") })]);
    expect(dernier[0].monthKey).toBe("2026-08");

    const hiver = groupByMonth([aPost({ id: "c", publishedAt: publicationInstant("2026-01-01") })]);
    expect(hiver[0].monthKey).toBe("2026-01");
  });

  it("Given posts of every category, When they are grouped by month, Then the flow ignores categories", () => {
    const rows = groupByMonth([
      aPost({ id: "ui", category: "UI", publishedAt: new Date("2026-08-04T00:00:00Z") }),
      aPost({ id: "perf", category: "PERF", publishedAt: new Date("2026-08-11T00:00:00Z") }),
    ]);

    expect(rows).toHaveLength(1);
    expect(rows[0].posts.map((p) => p.id)).toEqual(["perf", "ui"]);
  });
});
