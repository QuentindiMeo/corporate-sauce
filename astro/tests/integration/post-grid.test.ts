import type { ImageMetadata } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";

import visual from "@/assets/posts/01-virtualisation.png";
import PostGrid from "@/components/PostGrid.astro";
import PostRow from "@/components/PostRow.astro";
import type { Category } from "@domain/category";
import { aPost } from "../helpers/post-factory";
import { aThemeRowVm } from "../helpers/view-model-factory";

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

function row(category: Category, n: number) {
  return aThemeRowVm(
    category,
    Array.from({ length: n }, (_, i) => aPost<ImageMetadata>({ id: `${category}-${i}`, category, image: visual }))
  );
}

describe("Feature: PostRow component", () => {
  it("Given a theme row, When it is rendered, Then it shows the category tag and one card per post", async () => {
    const html = await container.renderToString(PostRow, {
      props: { row: row("PERF", 3) },
    });
    expect(html).toContain("PERF");
    expect((html.match(/data-post-id=/g) ?? []).length).toBe(3);
  });

  it("Given a theme row, When it is rendered, Then it is a region landmark labelled by its category (a11y)", async () => {
    const html = await container.renderToString(PostRow, {
      props: { row: row("A11Y", 1) },
    });
    expect(html).toMatch(/<section[^>]+aria-labelledby/);
  });
});

describe("Feature: PostGrid component", () => {
  it("Given several rows, When the grid is rendered, Then each row appears in the given order", async () => {
    const rows = [row("PERF", 2), row("A11Y", 1), row("UI", 4)];
    const html = await container.renderToString(PostGrid, { props: { rows } });

    const positions = ["PERF", "A11Y", "UI"].map((r) => html.indexOf(r));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(positions.every((p) => p >= 0)).toBe(true);
  });

  it("Given several rows, When the grid is rendered, Then the expected total number of cards is present", async () => {
    const rows = [row("PERF", 2), row("UI", 4)];
    const html = await container.renderToString(PostGrid, { props: { rows } });
    expect((html.match(/data-post-id=/g) ?? []).length).toBe(6);
  });
});
