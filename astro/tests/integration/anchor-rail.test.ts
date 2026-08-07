import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";

import AnchorRail from "@/components/AnchorRail.astro";
import type { RailItem } from "@/ui/nav/rail";

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

const items: RailItem[] = [
  { anchor: "category-perf", code: "PERF", full: "Performance", label: "Aller à la rubrique Performance (PERF)" },
  { anchor: "category-ui", code: "UI", full: "Interface utilisateur", label: "Aller à la rubrique Interface (UI)" },
];

const render = (props: Partial<Parameters<typeof AnchorRail>[0]> = {}) =>
  container.renderToString(AnchorRail, {
    props: { items, ariaLabel: "Navigation par rubrique", view: "theme", prefix: "category-", ...props },
  });

describe("Feature: AnchorRail order toggle", () => {
  it("Given the rail, When it is rendered, Then the order toggle is a button, not a link", async () => {
    const html = await render();

    expect(html).toMatch(/<button[^>]+type="button"/);
    expect(html).toContain("data-rail-order-toggle");
    expect(html).not.toMatch(/<a[^>]+data-rail-order-toggle/);
  });

  it("Given the order toggle, When it is rendered, Then it sits just above the list of markers", async () => {
    const html = await render();

    expect(html).toMatch(/data-rail-order-toggle[\s\S]*?<ul[\s>]/);
    expect(html).not.toMatch(/<ul[\s\S]*?data-rail-order-toggle/);
    // ? Le bouton vit DANS le repère de navigation : il disparaît avec le rail de la vue inactive.
    expect(html).toMatch(/<nav[^>]+data-rail[\s\S]*?data-rail-order-toggle/);
  });

  it("Given a stable accessible name, When the toggle is rendered, Then its state is carried by aria-pressed", async () => {
    const html = await render();

    // ? Ici le nom accessible ne bouge pas (l'icône seule dit l'état) : aria-pressed est l'attribut correct, contrairement à ViewToggle.
    expect(html).toContain('aria-pressed="false"');
    expect(html).toContain('aria-label="Inverser l\'ordre de lecture de la galerie"');
  });

  it("Given the toggle, When it is rendered, Then its icon is decorative and drawn in CSS", async () => {
    const html = await render();

    expect(html).toMatch(
      /anchor-rail__order-icon[^>]*aria-hidden="true"|aria-hidden="true"[^>]*anchor-rail__order-icon/
    );
    expect(html).not.toMatch(/data-rail-order-toggle[\s\S]*?<(svg|img)/);
  });

  it("Given the toggle, When it is rendered, Then it carries the instruction revealed on hover", async () => {
    const html = await render();
    expect(html).toMatch(/data-rail-order-toggle[\s\S]*?anchor-rail__order-hint[\s\S]*?inverser l'ordre/);
  });

  it("Given the instruction, When it is rendered, Then the accessible name contains its visible text (label-in-name)", async () => {
    const html = await render();

    // ! WCAG 2.5.3 : « inverser l'ordre » doit se retrouver dans le nom accessible, sans quoi la commande vocale échoue.
    const label = /data-rail-order-toggle[^>]*aria-label="([^"]*)"/.exec(html)?.[1] ?? "";
    expect(label.toLowerCase()).toContain("inverser l'ordre");
    // ? Le texte visible ne double PAS le nom accessible : c'est l'aria-label qui nomme, la consigne est décorative.
    expect(html).toMatch(
      /anchor-rail__order-hint[^>]*aria-hidden="true"|aria-hidden="true"[^>]*anchor-rail__order-hint/
    );
  });

  it("Given no JavaScript, When the rail is rendered, Then the toggle stays hidden", async () => {
    const html = await render();

    // ! Sans l'îlot, la bascule serait inerte : elle n'est révélée qu'une fois câblée.
    expect(html).toMatch(/<button[^>]+hidden/);
  });

  it("Given the toggle, When it is rendered, Then a polite live region carries the order change", async () => {
    const html = await render();

    expect(html).toMatch(/aria-live="polite"/);
    expect(html).toContain("data-rail-order-status");
  });

  it("Given no markers, When the rail is rendered, Then neither the rail nor its toggle is output", async () => {
    const html = await render({ items: [] });

    expect(html).not.toContain("<nav");
    expect(html).not.toContain("data-rail-order-toggle");
  });
});
