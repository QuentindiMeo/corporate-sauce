import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";

import MonthNav from "@/components/MonthNav.astro";
import { aMonthRowVm } from "../helpers/view-model-factory";

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

const month = (monthKey: string) => aMonthRowVm(monthKey, []);

describe("Feature: MonthNav component (date-view rail)", () => {
  it("Given month rows, When the nav is rendered, Then it is a labelled navigation landmark", async () => {
    const html = await container.renderToString(MonthNav, {
      props: { rows: [month("2026-08"), month("2026-07")] },
    });

    expect(html).toMatch(/<nav[^>]+aria-label="[^"]+"/);
  });

  it("Given month rows, When the nav is rendered, Then an anchor link points to each month section", async () => {
    const html = await container.renderToString(MonthNav, {
      props: { rows: [month("2026-08"), month("2026-07")] },
    });

    expect(html).toContain('href="#month-2026-08"');
    expect(html).toContain('href="#month-2026-07"');
  });

  it("Given a month, When the nav is rendered, Then the short code is visible and the full label is in the accessible name", async () => {
    const html = await container.renderToString(MonthNav, {
      props: { rows: [month("2026-08")] },
    });

    // ? Code court visible (« 08.26 ») + libellé complet dans le nom accessible.
    expect(html).toContain(">08.26<");
    expect(html).toMatch(/aria-label="Aller au mois d'août 2026 \(08\.26\)"/);
  });

  it("Given a consonant-initial month, When the nav is rendered, Then the preposition is not elided", async () => {
    const html = await container.renderToString(MonthNav, {
      props: { rows: [month("2026-07")] },
    });

    expect(html).toMatch(/aria-label="Aller au mois de juillet 2026 \(07\.26\)"/);
  });

  it("Given no month row, When the nav is rendered, Then nothing is output", async () => {
    const html = await container.renderToString(MonthNav, { props: { rows: [] } });
    expect(html).not.toContain("<nav");
  });

  it("Given the rail, When it is rendered, Then it declares the view it belongs to and its section prefix", async () => {
    const html = await container.renderToString(MonthNav, {
      props: { rows: [month("2026-08")] },
    });

    expect(html).toContain('data-rail-view="date"');
    expect(html).toContain('data-rail-prefix="month-"');
  });
});
