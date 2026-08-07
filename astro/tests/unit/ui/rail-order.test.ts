import { describe, expect, it } from "vitest";

import {
  DEFAULT_RAIL_ORDER,
  orderedRailItems,
  railOrderAnnouncement,
  toggleRailOrder,
  type RailOrder,
} from "@/ui/nav/rail-order";

describe("Feature: toggle the rail reading order", () => {
  it("Given an order, When it is toggled, Then it switches between natural and reversed", () => {
    expect(toggleRailOrder("natural")).toBe<RailOrder>("reversed");
    expect(toggleRailOrder("reversed")).toBe<RailOrder>("natural");
  });

  it("Given no interaction yet, Then the rail reads in the order the page renders", () => {
    expect(DEFAULT_RAIL_ORDER).toBe<RailOrder>("natural");
  });
});

describe("Feature: apply the reading order to the rail items", () => {
  it("Given the natural order, When it is applied, Then the items keep their rendering order", () => {
    expect(orderedRailItems(["PERF", "UI", "A11Y"], "natural")).toEqual(["PERF", "UI", "A11Y"]);
  });

  it("Given the reversed order, When it is applied, Then the items are mirrored", () => {
    expect(orderedRailItems(["PERF", "UI", "A11Y"], "reversed")).toEqual(["A11Y", "UI", "PERF"]);
  });

  it("Given any order, When it is applied, Then the input is left untouched", () => {
    const items = ["08.26", "07.26"];

    orderedRailItems(items, "reversed");

    // ! L'îlot garde une seule référence sur l'ordre de rendu et rejoue l'inversion depuis elle : la muter ferait dériver le rail bascule après bascule.
    expect(items).toEqual(["08.26", "07.26"]);
  });

  it("Given a single item, When the order is reversed, Then the rail is unchanged", () => {
    expect(orderedRailItems(["PERF"], "reversed")).toEqual(["PERF"]);
  });
});

describe("Feature: announce the rail reading order", () => {
  it("Given an order, When it is announced, Then the message names it in French", () => {
    expect(railOrderAnnouncement("reversed")).toBe("Ordre des repères inversé");
    expect(railOrderAnnouncement("natural")).toBe("Ordre des repères rétabli");
  });
});
