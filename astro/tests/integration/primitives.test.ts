import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";
import Highlight from "@/components/Highlight.astro";
import QdmBadge from "@/components/QdmBadge.astro";
import TagCategory from "@/components/TagCategory.astro";
import VerdictBadge from "@/components/VerdictBadge.astro";

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

describe("Feature: TagCategory component", () => {
  it("Given a category, When the tag is rendered, Then the category appears in uppercase", async () => {
    const html = await container.renderToString(TagCategory, {
      props: { category: "PERF" },
    });
    expect(html).toContain("PERF");
    expect(html).toMatch(/class="[^"]*tag-category/);
  });
});

describe("Feature: QdmBadge component", () => {
  it("Given the badge, When it is rendered, Then the QDM logotype appears", async () => {
    const html = await container.renderToString(QdmBadge);
    expect(html).toContain("QDM");
  });
});

describe("Feature: VerdictBadge component", () => {
  it("Given the positive verdict, When the badge is rendered, Then a ✓ with an accessible label appears", async () => {
    const html = await container.renderToString(VerdictBadge, {
      props: { type: "ok" },
    });
    expect(html).toContain("✓");
    expect(html).toMatch(/aria-label="[^"]+"/);
  });

  it("Given the negative verdict, When the badge is rendered, Then a ✕ appears", async () => {
    const html = await container.renderToString(VerdictBadge, {
      props: { type: "bad" },
    });
    expect(html).toContain("✕");
  });
});

describe("Feature: Highlight component", () => {
  it("Given slot content, When the highlight is rendered, Then the content is wrapped", async () => {
    const html = await container.renderToString(Highlight, {
      slots: { default: "mot-clé" },
    });
    expect(html).toContain("mot-clé");
    expect(html).toMatch(/class="[^"]*highlight/);
  });
});
