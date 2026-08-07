import type { ImageMetadata } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";

import visual from "@/assets/posts/01-virtualisation.png";
import Gallery from "@/components/Gallery.astro";
import ViewToggle from "@/components/ViewToggle.astro";
import { aPost } from "../helpers/post-factory";
import { aMonthRowVm, aThemeRowVm } from "../helpers/view-model-factory";

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

const themeRows = [
  aThemeRowVm("PERF", [aPost<ImageMetadata>({ id: "p1", category: "PERF", image: visual })]),
  aThemeRowVm("UI", [aPost<ImageMetadata>({ id: "u1", category: "UI", image: visual })]),
];
const monthRows = [
  aMonthRowVm("2026-08", [
    aPost<ImageMetadata>({ id: "p1", image: visual }),
    aPost<ImageMetadata>({ id: "u1", image: visual }),
  ]),
];

describe("Feature: ViewToggle component", () => {
  it("Given the toggle, When it is rendered, Then it is a button, not a link", async () => {
    const html = await container.renderToString(ViewToggle);

    expect(html).toMatch(/<button[^>]+type="button"/);
    expect(html).toContain("data-view-toggle");
    expect(html).not.toMatch(/<a[^>]+data-view-toggle/);
  });

  it("Given the toggle, When it is rendered, Then both states are built so CSS alone can show the active one", async () => {
    const html = await container.renderToString(ViewToggle);

    // ? Les deux états sont dans le HTML (comme les panneaux de galerie) : un visiteur revenant en vue date ne voit jamais clignoter le libellé de l'autre état.
    expect(html).toContain('data-view-state="theme"');
    expect(html).toContain('data-view-state="date"');
    expect(html).toContain("Par rubrique");
    expect(html).toContain("Par date");
  });

  it("Given each state, When it is rendered, Then it carries its own decorative icon", async () => {
    const html = await container.renderToString(ViewToggle);

    expect(html).toMatch(/view-toggle__icon--rows/);
    expect(html).toMatch(/view-toggle__icon--calendar/);
    // ? Les icônes sont décoratives : le sens est porté par le libellé texte (charte §2).
    expect((html.match(/aria-hidden="true"/g) ?? []).length).toBeGreaterThanOrEqual(2);
  });

  it("Given a changing label, When the toggle is rendered, Then aria-pressed is absent", async () => {
    const html = await container.renderToString(ViewToggle);

    // ! Un bouton à bascule ne doit PAS changer de nom accessible (ARIA APG). Puisque le libellé nomme la vue affichée,
    // ! l'état ne peut pas passer par aria-pressed : le bouton devient un bouton d'action, dont le nom dit l'état ET l'action.
    expect(html).not.toContain("aria-pressed");
  });

  it("Given a state, When it is rendered, Then its accessible name states the current view then the action", async () => {
    const html = await container.renderToString(ViewToggle);

    // ? Nom accessible = texte du sous-arbre visible : libellé + complément masqué.
    expect(html).toMatch(/Par rubrique[\s\S]*?basculer sur la vue par date/);
    expect(html).toMatch(/Par date[\s\S]*?basculer sur la vue par rubrique/);
  });

  it("Given the toggle, When it is rendered, Then a polite live region carries the view change", async () => {
    const html = await container.renderToString(ViewToggle);

    expect(html).toMatch(/aria-live="polite"/);
    expect(html).toContain("data-view-status");
  });
});

describe("Feature: Gallery component (both views built statically)", () => {
  it("Given both views, When the gallery is rendered, Then each panel is present and tagged", async () => {
    const html = await container.renderToString(Gallery, { props: { themeRows, monthRows } });

    expect(html).toContain('data-view-panel="theme"');
    expect(html).toContain('data-view-panel="date"');
  });

  it("Given both views, When the gallery is rendered, Then every post appears in each panel (no client rendering)", async () => {
    const html = await container.renderToString(Gallery, { props: { themeRows, monthRows } });

    // ? 2 posts × 2 panneaux : le HTML est complet dès le build (SEO, sans JS).
    expect((html.match(/data-post-id=/g) ?? []).length).toBe(4);
    expect(html).toContain('id="category-perf"');
    expect(html).toContain('id="month-2026-08"');
  });

  it("Given the theme view is the default, When the gallery is rendered, Then exactly one image is eager (single LCP candidate)", async () => {
    const html = await container.renderToString(Gallery, { props: { themeRows, monthRows } });

    expect((html.match(/loading="eager"/g) ?? []).length).toBe(1);
  });
});
