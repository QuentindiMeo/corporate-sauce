import { expect, test, type Page } from "@playwright/test";

test.describe("Feature: reading order toggle (rail + gallery)", () => {
  // ? Le rail ne s'affiche qu'avec assez de gouttière latérale (cf. AnchorRail).
  test.use({ viewport: { width: 1440, height: 900 } });

  const rail = '[data-rail-view="theme"]';
  const links = `${rail} [data-rail-anchor]`;
  const toggle = `${rail} [data-rail-order-toggle]`;
  const sections = '[data-view-panel="theme"] [aria-labelledby^="category-"]';
  const firstTrackPosts = `${sections} >> nth=0 >> [data-post-id]`;

  const attrs = (page: Page, selector: string, attribute: string) =>
    page
      .locator(selector)
      .evaluateAll((nodes: HTMLElement[], name: string) => nodes.map((node) => node.getAttribute(name)), attribute);

  const markers = (page: Page) => attrs(page, links, "data-rail-anchor");
  const categories = (page: Page) => attrs(page, sections, "aria-labelledby");
  const posts = (page: Page) => attrs(page, firstTrackPosts, "data-post-id");

  test("Given JavaScript, When the rail is displayed, Then the order toggle is revealed and unpressed", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/");

    await expect(page.locator(toggle)).toBeVisible();
    await expect(page.locator(toggle)).toHaveAttribute("aria-pressed", "false");
  });

  test("Given the toggle, When it is clicked, Then the markers are reordered in the DOM, so tab order follows", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/");
    const before = await markers(page);

    await page.locator(toggle).click();

    await expect(page.locator(toggle)).toHaveAttribute("aria-pressed", "true");
    // ! Ordre du DOM, et non un simple `column-reverse` : c'est aussi l'ordre de tabulation (WCAG 2.4.3).
    expect(await markers(page)).toEqual([...before].reverse());
  });

  test("Given the toggle, When it is clicked, Then the gallery sections are mirrored like the rail", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/");
    const before = await categories(page);
    expect(before.length).toBeGreaterThan(1);

    await page.locator(toggle).click();

    // ? Le rail indexe le flux : les deux doivent basculer ensemble, sinon le rail contredirait la page.
    expect(await categories(page)).toEqual([...before].reverse());
    expect(await markers(page)).toEqual(await categories(page));
  });

  test("Given the toggle, When it is clicked, Then the posts inside a section are mirrored too", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/");
    const before = await posts(page);
    expect(before.length).toBeGreaterThan(1);

    await page.locator(toggle).click();

    // ? La 1re section passe en dernier : ses posts s'y retrouvent, eux aussi en miroir.
    expect(await attrs(page, `${sections} >> nth=-1 >> [data-post-id]`, "data-post-id")).toEqual([...before].reverse());
  });

  test("Given a reversed view, When the toggle is clicked again, Then the rendering order is restored", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/");
    const beforeMarkers = await markers(page);
    const beforeCategories = await categories(page);
    const beforePosts = await posts(page);

    await page.locator(toggle).click();
    await page.locator(toggle).click();

    await expect(page.locator(toggle)).toHaveAttribute("aria-pressed", "false");
    expect(await markers(page)).toEqual(beforeMarkers);
    expect(await categories(page)).toEqual(beforeCategories);
    expect(await posts(page)).toEqual(beforePosts);
  });

  test("Given the date view, When its rail is toggled, Then the month flow is mirrored, not the category one", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/");
    await page.locator("[data-view-toggle]").click();

    const monthSections = '[data-view-panel="date"] [aria-labelledby^="month-"]';
    const beforeMonths = await attrs(page, monthSections, "aria-labelledby");
    const beforeCategories = await categories(page);

    await page.locator('[data-rail-view="date"] [data-rail-order-toggle]').click();

    expect(await attrs(page, monthSections, "aria-labelledby")).toEqual([...beforeMonths].reverse());
    // ? Chaque rail ne réagence QUE sa vue : la vue par rubrique garde son ordre de rendu.
    expect(await categories(page)).toEqual(beforeCategories);
  });

  test("Given the toggle, When the order changes, Then the change is announced politely", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/");

    await page.locator(toggle).click();

    await expect(page.locator(`${rail} [data-rail-order-status]`)).toHaveText("Ordre de lecture inversé");
  });

  test("Given a reversed view, When the page is reloaded, Then the choice persists — rail and gallery alike", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/");
    const rendered = await categories(page);

    await page.locator(toggle).click();
    await page.reload();

    await expect(page.locator(toggle)).toHaveAttribute("aria-pressed", "true");
    expect(await categories(page)).toEqual([...rendered].reverse());
    expect(await markers(page)).toEqual([...rendered].reverse());
  });

  test("Given a restored view, When the page is reloaded, Then the rendering order comes back", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/");
    const rendered = await categories(page);

    await page.locator(toggle).click();
    await page.locator(toggle).click();
    await page.reload();

    await expect(page.locator(toggle)).toHaveAttribute("aria-pressed", "false");
    expect(await categories(page)).toEqual(rendered);
  });

  test("Given an order restored at load, When the toggle is clicked, Then the view flips back once, without drifting", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/");
    const rendered = await categories(page);

    await page.locator(toggle).click();
    await page.reload();
    // ! Le script pré-rendu a déjà inversé le DOM : l'îlot doit repartir de CET état, pas d'un ordre de rendu mémorisé.
    await page.locator(toggle).click();

    await expect(page.locator(toggle)).toHaveAttribute("aria-pressed", "false");
    expect(await categories(page)).toEqual(rendered);
  });

  test("Given each view its own order, When only the theme rail is reversed, Then the date flow stays natural across reloads", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/");
    const monthSections = '[data-view-panel="date"] [aria-labelledby^="month-"]';
    const renderedMonths = await attrs(page, monthSections, "aria-labelledby");

    await page.locator(toggle).click();
    await page.reload();

    expect(await attrs(page, monthSections, "aria-labelledby")).toEqual(renderedMonths);
    expect(await page.evaluate(() => localStorage.getItem("qdm-order"))).toBe(
      JSON.stringify({ theme: "reversed", date: "natural" })
    );
  });

  // ? Se poser sur un repère du milieu et attendre que le défilement `smooth` s'immobilise,
  // ? sans quoi la mesure « avant » serait prise en pleine animation.
  const settleOn = async (page: Page, index: number) => {
    const anchor = (await markers(page))[index];
    if (!anchor) {
      throw new Error(`Aucun repère à l'index ${index} : le rail n'en compte pas assez.`);
    }

    await page.locator(links).nth(index).click();
    await page.waitForFunction((id: string) => {
      const top = document.getElementById(id)?.getBoundingClientRect().top;
      const memo = window as unknown as { __top?: number };
      const settled = top !== undefined && memo.__top === top;
      memo.__top = top;
      return settled;
    }, anchor);
    await expect(page.locator(`${rail} [data-rail-anchor="${anchor}"]`)).toHaveAttribute("aria-current", "true");
    return anchor;
  };

  test("Given a current marker, When the order is inverted, Then the marker at the SAME index becomes current", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/");
    await settleOn(page, 2);

    await page.locator(toggle).click();

    // ? La PLACE dans le rail est conservée : c'est le repère qui l'occupe désormais (le symétrique) qui prend la main.
    const current = await attrs(page, links, "aria-current");
    expect(current.indexOf("true")).toBe(2);
    expect(current.filter((value: string) => value === "true")).toHaveLength(1);
  });

  test("Given a current marker, When the order is inverted, Then its counterpart is brought to the reading position", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/");
    const anchorBefore = await settleOn(page, 2);

    await page.locator(toggle).click();

    const anchorAfter = (await markers(page))[2];
    expect(anchorAfter).not.toBe(anchorBefore);
    const top = await page.locator(`#${anchorAfter}`).evaluate((node: HTMLElement) => node.getBoundingClientRect().top);
    // ? Amenée en haut du viewport, `scroll-margin-top: 4rem` compris — comme au clic sur un repère.
    expect(top).toBeGreaterThan(0);
    expect(top).toBeLessThan(200);
  });

  test("Given a page scrolled to its end, When the order is inverted, Then the forced index still holds", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
    await expect.poll(async () => (await attrs(page, links, "aria-current")).indexOf("true")).toBeGreaterThan(0);
    const indexBefore = (await attrs(page, links, "aria-current")).indexOf("true");

    await page.locator(toggle).click();

    // ! En bas du document le défilement est borné : la section visée ne PEUT pas rejoindre la bande du scrollspy.
    // ! Sans le verrou `data-rail-forced`, l'observateur reprenait la main et l'index sautait (constaté : 6 → 5).
    await page.waitForTimeout(600);
    expect((await attrs(page, links, "aria-current")).indexOf("true")).toBe(indexBefore);
  });

  test("Given a forced marker, When the reader scrolls again, Then the scrollspy takes over", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/");
    await settleOn(page, 2);
    await page.locator(toggle).click();

    // ? Le verrou ne dure QUE jusqu'au prochain geste : la molette rend la main à l'observateur.
    await page.mouse.move(700, 500);
    await page.mouse.wheel(0, 2500);

    await expect.poll(async () => (await attrs(page, links, "aria-current")).indexOf("true")).not.toBe(2);
  });

  test("Given the toggle, When it is hovered, Then a dimmed instruction unfolds next to it", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/");
    const hint = page.locator(`${toggle} .anchor-rail__order-hint`);

    // ? Replié : la consigne est bien dans le DOM, mais sans largeur ni opacité.
    expect(await hint.evaluate((node: HTMLElement) => node.getBoundingClientRect().width)).toBeLessThan(1);

    await page.locator(toggle).hover();

    await expect(hint).toHaveText("inverser l'ordre");
    await expect.poll(async () => hint.evaluate((node: HTMLElement) => node.getBoundingClientRect().width)).toBeGreaterThan(40);
    // ? Atténuée : la consigne reste en --muted quand l'icône, elle, passe en --fg.
    const [hintColor, iconColor] = await Promise.all([
      hint.evaluate((node: HTMLElement) => getComputedStyle(node).color),
      page.locator(`${toggle} .anchor-rail__order-icon`).evaluate((node: HTMLElement) => getComputedStyle(node).color),
    ]);
    expect(hintColor).not.toBe(iconColor);
  });

  test("Given the toggle, When it is focused by keyboard, Then the same instruction unfolds", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/");
    const hint = page.locator(`${toggle} .anchor-rail__order-hint`);

    // ! On ARRIVE au clavier (Shift+Tab depuis le 1er repère, qui suit le bouton dans le DOM) : un `focus()`
    // ! programmatique ne déclenche pas `:focus-visible` dans Chromium, et le test passerait à côté du sujet.
    await page.locator(links).first().focus();
    await page.keyboard.press("Shift+Tab");
    await expect(page.locator(toggle)).toBeFocused();

    // ? `:focus-visible` suit le survol : la consigne n'est pas réservée à la souris.
    await expect.poll(async () => hint.evaluate((node: HTMLElement) => node.getBoundingClientRect().width)).toBeGreaterThan(40);
  });

  test("Given a reordered view, When a marker is clicked, Then the scrollspy still tracks the visible section", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/");
    await page.locator(toggle).click();

    // ? Les nœuds sont DÉPLACÉS, pas recréés : le scrollspy garde ses références.
    const second = page.locator(links).nth(1);
    const anchor = await second.getAttribute("data-rail-anchor");
    await second.click();

    await expect(page.locator(`#${anchor}`)).toBeVisible();
    await expect(second).toHaveAttribute("aria-current", "true");
  });
});
