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
    page.locator(selector).evaluateAll((nodes: HTMLElement[], name: string) => nodes.map((node) => node.getAttribute(name)), attribute);

  const markers = (page: Page) => attrs(page, links, "data-rail-anchor");
  const categories = (page: Page) => attrs(page, sections, "aria-labelledby");
  const posts = (page: Page) => attrs(page, firstTrackPosts, "data-post-id");

  test("Given JavaScript, When the rail is displayed, Then the order toggle is revealed and unpressed", async ({
    page,
  }: { page: Page }) => {
    await page.goto("/");

    await expect(page.locator(toggle)).toBeVisible();
    await expect(page.locator(toggle)).toHaveAttribute("aria-pressed", "false");
  });

  test("Given the toggle, When it is clicked, Then the markers are reordered in the DOM, so tab order follows", async ({
    page,
  }: { page: Page }) => {
    await page.goto("/");
    const before = await markers(page);

    await page.locator(toggle).click();

    await expect(page.locator(toggle)).toHaveAttribute("aria-pressed", "true");
    // ! Ordre du DOM, et non un simple `column-reverse` : c'est aussi l'ordre de tabulation (WCAG 2.4.3).
    expect(await markers(page)).toEqual([...before].reverse());
  });

  test("Given the toggle, When it is clicked, Then the gallery sections are mirrored like the rail", async ({
    page,
  }: { page: Page }) => {
    await page.goto("/");
    const before = await categories(page);
    expect(before.length).toBeGreaterThan(1);

    await page.locator(toggle).click();

    // ? Le rail indexe le flux : les deux doivent basculer ensemble, sinon le rail contredirait la page.
    expect(await categories(page)).toEqual([...before].reverse());
    expect(await markers(page)).toEqual(await categories(page));
  });

  test("Given the toggle, When it is clicked, Then the posts inside a section are mirrored too", async ({ page }: { page: Page }) => {
    await page.goto("/");
    const before = await posts(page);
    expect(before.length).toBeGreaterThan(1);

    await page.locator(toggle).click();

    // ? La 1re section passe en dernier : ses posts s'y retrouvent, eux aussi en miroir.
    expect(await attrs(page, `${sections} >> nth=-1 >> [data-post-id]`, "data-post-id")).toEqual([...before].reverse());
  });

  test("Given a reversed view, When the toggle is clicked again, Then the rendering order is restored", async ({
    page,
  }: { page: Page }) => {
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
  }: { page: Page }) => {
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

  test("Given the toggle, When the order changes, Then the change is announced politely", async ({ page }: { page: Page }) => {
    await page.goto("/");

    await page.locator(toggle).click();

    await expect(page.locator(`${rail} [data-rail-order-status]`)).toHaveText("Ordre de lecture inversé");
  });

  test("Given a reordered view, When a marker is clicked, Then the scrollspy still tracks the visible section", async ({
    page }: { page: Page }) => {
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
