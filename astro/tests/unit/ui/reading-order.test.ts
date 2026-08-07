import { describe, expect, it } from "vitest";

import {
  DEFAULT_READING_ORDER,
  inReadingOrder,
  readingOrderAnnouncement,
  toggleReadingOrder,
  type ReadingOrder,
} from "@/ui/view/reading-order";

describe("Feature: toggle the reading order", () => {
  it("Given an order, When it is toggled, Then it switches between natural and reversed", () => {
    expect(toggleReadingOrder("natural")).toBe<ReadingOrder>("reversed");
    expect(toggleReadingOrder("reversed")).toBe<ReadingOrder>("natural");
  });

  it("Given no interaction yet, Then the view reads in the order the page renders", () => {
    expect(DEFAULT_READING_ORDER).toBe<ReadingOrder>("natural");
  });
});

describe("Feature: apply the reading order to a level of the view", () => {
  it("Given the natural order, When it is applied, Then the items keep their rendering order", () => {
    expect(inReadingOrder(["PERF", "UI", "A11Y"], "natural")).toEqual(["PERF", "UI", "A11Y"]);
  });

  it("Given the reversed order, When it is applied, Then the items are mirrored", () => {
    expect(inReadingOrder(["PERF", "UI", "A11Y"], "reversed")).toEqual(["A11Y", "UI", "PERF"]);
  });

  it("Given the same order, When it is applied to every level, Then rail, sections and posts stay consistent", () => {
    // ? Une seule règle sert les trois niveaux : le rail ne peut donc pas contredire la galerie.
    const markers = ["08.26", "07.26"];
    const sections = ["month-2026-08", "month-2026-07"];
    const posts = ["p1", "p2", "p3"];

    expect(inReadingOrder(markers, "reversed")).toEqual(["07.26", "08.26"]);
    expect(inReadingOrder(sections, "reversed")).toEqual(["month-2026-07", "month-2026-08"]);
    expect(inReadingOrder(posts, "reversed")).toEqual(["p3", "p2", "p1"]);
  });

  it("Given any order, When it is applied, Then the input is left untouched", () => {
    const items = ["08.26", "07.26"];

    inReadingOrder(items, "reversed");

    // ! L'îlot garde une seule référence sur l'ordre de rendu et rejoue l'inversion depuis elle : la muter ferait dériver la vue bascule après bascule.
    expect(items).toEqual(["08.26", "07.26"]);
  });

  it("Given a single item, When the order is reversed, Then the level is unchanged", () => {
    expect(inReadingOrder(["PERF"], "reversed")).toEqual(["PERF"]);
  });
});

describe("Feature: announce the reading order", () => {
  it("Given an order, When it is announced, Then the message names it in French", () => {
    expect(readingOrderAnnouncement("reversed")).toBe("Ordre de lecture inversé");
    expect(readingOrderAnnouncement("natural")).toBe("Ordre de lecture rétabli");
  });
});
