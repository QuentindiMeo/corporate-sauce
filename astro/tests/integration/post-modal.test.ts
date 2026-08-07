import type { ImageMetadata } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeAll, describe, expect, it } from "vitest";

import visual from "@/assets/posts/01-virtualisation.png";
import PostModal from "@/components/PostModal.astro";
import { publicationInstant } from "@domain/publication-time";
import { aPost } from "../helpers/post-factory";
import { aPostVm } from "../helpers/view-model-factory";

/**
 * ! Ce fichier comble un trou repéré en Phase 8 : `PostModal` n'était rendu par AUCUN test.
 * ! Une erreur de syntaxe y était passée à travers toute la suite Vitest, et seul `astro build`
 * ! l'avait attrapée. Le composant porte pourtant deux contrats consommés par du JS :
 * ! `data-post-template` (contrôleur de modale) et `data-post-at` (compteur « à paraître »).
 */
let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

const posts = [
  aPostVm({ id: "un", image: visual, publishedAt: publicationInstant("2026-08-05") }),
  aPostVm({ id: "deux", image: visual, publishedAt: publicationInstant("2026-09-02") }),
];

const render = (props = { posts }) => container.renderToString(PostModal, { props });

describe("Feature: PostModal component", () => {
  it("Given posts, When the shell is rendered, Then it exposes one template per post", async () => {
    const html = await render();

    expect((html.match(/<template /g) ?? []).length).toBe(2);
    expect(html).toContain('data-post-template="un"');
    expect(html).toContain('data-post-template="deux"');
  });

  it("Given posts, When the shell is rendered, Then each template carries its publication instant", async () => {
    const html = await render();

    // ? C'est cette liste — un template par post — que le compteur d'intro dénombre, car les
    // ? vignettes sont rendues deux fois (un panneau par vue) et fausseraient le total.
    expect(html).toContain('data-post-at="2026-08-05T09:00:00.000Z"');
    expect(html).toContain('data-post-at="2026-09-02T09:00:00.000Z"');
    expect((html.match(/data-post-at=/g) ?? []).length).toBe(2);
  });

  it("Given the shell, When it is rendered, Then the dialog is an accessible modal with a close button", async () => {
    const html = await render();

    expect(html).toMatch(/<dialog[^>]+data-post-modal/);
    expect(html).toMatch(/<dialog[^>]+aria-modal="true"/);
    expect(html).toMatch(/<dialog[^>]+aria-label="[^"]+"/);
    expect(html).toMatch(/<button[^>]+data-modal-close/);
    expect(html).toContain("data-modal-body");
  });

  it("Given the templates, When the shell is rendered, Then they are hidden from the page flow", async () => {
    const html = await render();

    // Le contenu pré-rendu ne doit pas s'afficher : il est cloné dans le dialog au clic.
    expect(html).toMatch(/<div hidden data-modal-templates/);
  });

  it("Given each template, When the shell is rendered, Then it holds the post content", async () => {
    const html = await render();

    expect(html).toContain("modal-post");
    expect((html.match(/class="modal-post"/g) ?? []).length).toBe(2);
  });

  it("Given no post, When the shell is rendered, Then the dialog still exists but holds no template", async () => {
    const html = await render({ posts: [] });

    expect(html).toMatch(/<dialog[^>]+data-post-modal/);
    expect(html).not.toContain("<template ");
  });

  it("Given an entity-shaped post, Then the shell only accepts view models (compile-time contract)", () => {
    // ? Garde-fou de lecture : `aPost` produit une ENTITÉ, `aPostVm` un VIEW MODEL. Les
    // ? composants ne consomment que le second (action.md §3) — ce que le typecheck impose.
    const entity = aPost<ImageMetadata>({ image: visual });
    expect(entity).not.toHaveProperty("publishedAtIso");
    expect(aPostVm({ image: visual })).toHaveProperty("publishedAtIso");
  });
});
