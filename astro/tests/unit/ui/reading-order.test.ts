import { describe, expect, it } from "vitest";

import {
  DEFAULT_READING_ORDER,
  READING_ORDER_STORAGE_KEY,
  mirrored,
  readingOrderAnnouncement,
  readingOrdersStorageValue,
  resolveInitialReadingOrders,
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

describe("Feature: mirror a level of the view", () => {
  it("Given items, When they are mirrored, Then their order is reversed", () => {
    expect(mirrored(["PERF", "UI", "A11Y"])).toEqual(["A11Y", "UI", "PERF"]);
  });

  it("Given a mirrored level, When it is mirrored again, Then the rendering order is back (involution)", () => {
    // ! C'est ce qui autorise l'îlot à miroiter le DOM COURANT sans mémoriser l'ordre de rendu : aucune dérive possible.
    const items = ["PERF", "UI", "A11Y"];

    expect(mirrored(mirrored(items))).toEqual(items);
  });

  it("Given items, When they are mirrored, Then the input is left untouched", () => {
    const items = ["08.26", "07.26"];

    mirrored(items);

    expect(items).toEqual(["08.26", "07.26"]);
  });

  it("Given a single item, When it is mirrored, Then the level is unchanged", () => {
    expect(mirrored(["PERF"])).toEqual(["PERF"]);
  });
});

describe("Feature: announce the reading order", () => {
  it("Given an order, When it is announced, Then the message names it in French", () => {
    expect(readingOrderAnnouncement("reversed")).toBe("Ordre de lecture inversé");
    expect(readingOrderAnnouncement("natural")).toBe("Ordre de lecture rétabli");
  });
});

describe("Feature: resolve the stored reading orders", () => {
  it("Given a stored choice per view, When it is resolved, Then each view keeps its own order", () => {
    expect(resolveInitialReadingOrders('{"theme":"reversed","date":"natural"}')).toEqual({
      theme: "reversed",
      date: "natural",
    });
    expect(resolveInitialReadingOrders('{"theme":"natural","date":"reversed"}')).toEqual({
      theme: "natural",
      date: "reversed",
    });
  });

  it("Given no stored choice, When it is resolved, Then both views read in the rendering order", () => {
    expect(resolveInitialReadingOrders(null)).toEqual({ theme: "natural", date: "natural" });
    expect(resolveInitialReadingOrders("")).toEqual({ theme: "natural", date: "natural" });
  });

  it("Given a partial or unknown value, When it is resolved, Then only the valid view is honoured", () => {
    expect(resolveInitialReadingOrders('{"theme":"reversed"}')).toEqual({ theme: "reversed", date: "natural" });
    expect(resolveInitialReadingOrders('{"theme":"à l’envers","date":"reversed"}')).toEqual({
      theme: "natural",
      date: "reversed",
    });
  });

  it("Given a corrupted or foreign value, When it is resolved, Then it falls back to the rendering order", () => {
    // ! Un stockage écrit par une version antérieure — ou à la main — ne doit jamais casser l'affichage.
    expect(resolveInitialReadingOrders("{pas du json")).toEqual({ theme: "natural", date: "natural" });
    expect(resolveInitialReadingOrders('"reversed"')).toEqual({ theme: "natural", date: "natural" });
    expect(resolveInitialReadingOrders("null")).toEqual({ theme: "natural", date: "natural" });
    expect(resolveInitialReadingOrders("[]")).toEqual({ theme: "natural", date: "natural" });
  });

  it("Given written orders, When they are read back, Then the round trip is faithful", () => {
    const orders = { theme: "reversed", date: "natural" } as const;

    expect(resolveInitialReadingOrders(readingOrdersStorageValue(orders))).toEqual(orders);
  });
});

describe("Feature: reading order storage key", () => {
  it("Given READING_ORDER_STORAGE_KEY, Then it is a stable key, distinct from the theme and view keys", () => {
    // ! Figée ici : le script pré-peinture de `Gallery` la répète en littéral (il ne peut rien importer).
    expect(READING_ORDER_STORAGE_KEY).toBe("qdm-order");
  });
});
