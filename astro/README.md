# Galerie QDM

Site vitrine des posts LinkedIn de **QDM — _Question. Design. Materialize._**
Galerie de vignettes regroupées par thème, avec :

- **grille** de 7 rubriques (PERF · A11Y · DX · UI · ARCHI · HTML · COLLAB), survol qui grossit/incline la vignette ;
- **navbar verticale** de rubriques (scrollspy) et **bascule de thème** clair/sombre, header **sticky** ;
- **modale** au clic : visuel HD, légende complète, lien LinkedIn ;
- **posts carrousel** (« fard ») : pile de pages pliées en vignette, carrousel navigable dans la modale.

Français, responsive, accessible (WCAG AA), minimaliste.
Plan de développement et suivi des phases : [`../action.md`](../action.md).

## Stack

- **Astro 7** (statique), Content Collections, `astro:assets` (images WebP responsives)
- **Architecture hexagonale** : `domain` / `application` / `infrastructure` + UI (Astro)
- **TDD** (Vitest + Container API + happy-dom) et **e2e** (Playwright + axe-core)
- Typographie de la charte self-hostée (Space Grotesk, JetBrains Mono, Hanken Grotesk)

## Prérequis

- **Node ≥ 22.12** (le projet échoue sous une version antérieure).
- **pnpm** (ne pas utiliser npm). Version épinglée via `packageManager`.

```sh
# exemple avec nvm
nvm use 22
corepack enable   # fournit le bon pnpm depuis packageManager
```

## Commandes

| Commande          | Effet                                      |
| ----------------- | ------------------------------------------ |
| `pnpm install`    | Installe les dépendances                   |
| `pnpm dev`        | Serveur de développement                   |
| `pnpm build`      | Build statique dans `dist/`                |
| `pnpm preview`    | Sert le build                              |
| `pnpm test`       | Tests unitaires & intégration (Vitest)     |
| `pnpm test:watch` | Vitest en continu (boucle TDD)             |
| `pnpm coverage`   | Couverture (seuil ≥ 90 % sur le cœur)      |
| `pnpm test:e2e`   | Tests end-to-end (Playwright + axe)        |
| `pnpm lint`       | ESLint                                     |
| `pnpm typecheck`  | `astro check`                              |
| `pnpm check`      | Porte de qualité : lint + typecheck + test |

Avant toute e2e locale : `pnpm exec playwright install chromium`.

## Ajouter ou modifier un post (sans redéployer de code)

Le contenu vit dans **`src/data/posts.json`** — pas dans le code. Pour ajouter un post :

1. Déposer le(s) visuel(s) dans `src/assets/posts/` (un PNG portrait, ou un dossier
   `carrousel-XX/01.png, 02.png, …` pour un carrousel).
2. Ajouter une entrée dans `src/data/posts.json`.

**Post à visuel unique :**

```json
{
  "id": "01-virtualisation",
  "category": "PERF",
  "mode": "sombre",
  "title": "Virtualisation",
  "body": "Légende LinkedIn complète.\nLes retours à la ligne sont préservés.\n\nDeuxième paragraphe…",
  "hashtags": ["Performance", "Frontend"],
  "image": "../assets/posts/01-virtualisation.png",
  "imageAlt": "Description accessible du visuel (obligatoire)",
  "linkedInUrl": "https://www.linkedin.com/posts/…",
  "publishedAt": "2026-01-06",
  "order": 1
}
```

**Post carrousel** — ajouter un tableau `pages` (≥ 2 pages) ; la vignette devient un « fard » :

```json
{
  "…": "mêmes champs que ci-dessus",
  "image": "../assets/posts/carrousel-07/01.png",
  "pages": [
    { "image": "../assets/posts/carrousel-07/01.png", "alt": "« Titre » — page 1/2." },
    { "image": "../assets/posts/carrousel-07/02.png", "alt": "« Titre » — page 2/2." }
  ]
}
```

Champs :

- `category` ∈ `PERF · A11Y · DX · UI · ARCHI · HTML · COLLAB` (détermine la ligne).
- `mode` ∈ `sombre · clair · liant` (palette de la charte appliquée à la modale).
- `title` — libellé court affiché sur la vignette et en titre de modale.
- `body` — légende LinkedIn complète ; les sauts de ligne sont conservés (`white-space: pre-line`).
- `hashtags` — optionnel, sans le `#`. Affichés en pied de modale.
- `pages` — optionnel ; ≥ 2 pages ⇒ post carrousel (sinon visuel unique via `image`).
- `subtitle`, `takeaway`, `cta` — optionnels (peu utilisés avec les vraies légendes).
- `linkedInUrl` **doit** être une URL `https://…linkedin.com/…` (validée par le domaine au build).

Le schéma (`src/content.config.ts`) valide chaque entrée au build ; le vocabulaire
(`category`, `mode`) vient du domaine (source unique).

> Le contenu réel provient de `../contents/` (légendes `.txt` + visuels). La
> stylisation unicode LinkedIn (gras/italique/mono) est ramenée en caractères
> normaux à la génération.

## Architecture (hexagonale)

```
src/
├─ domain/            entités, value objects, ports (zéro dépendance framework)
├─ application/       cas d'usage (dépend de domain/)
├─ infrastructure/    adaptateurs (Content Collections → domain)
├─ components/        UI Astro (grille, vignette/fard, modale + carrousel, navbar, primitives)
├─ ui/theme|modal|seo logique UI testable (tokens, thème, modale, carrousel, JSON-LD)
├─ pages/  layouts/  styles/   présentation
├─ assets/posts/      visuels optimisés (singles + dossiers carrousel-XX/)
└─ data/posts.json    source de contenu
```

Règle de dépendance : `pages/components → application → domain` ; `infrastructure → domain`.
Le domaine n'importe jamais Astro (garde-fou ESLint dans `eslint.config.js`).

Convention de langue : **code en anglais**, **commentaires en français**, **contenu utilisateur en français**.

## Méthodologie — TDD

Rouge → vert → refactor (voir `../action.md` §8). On écrit le test qui échoue
d'abord, puis le minimum de code pour le faire passer, puis on nettoie. Le cœur
(domain/application) se teste sans framework ; l'UI via la Container API ; les
parcours via Playwright.

## Déploiement

CI (`.github/workflows/ci.yml`) : lint → typecheck → test → e2e → build, bloquant.

Déploiement (`.github/workflows/deploy.yml`) piloté par la variable de dépôt
`DEPLOY_TARGET` :

- **Cloudflare Pages** (`DEPLOY_TARGET=cloudflare`) — secrets `CLOUDFLARE_API_TOKEN`,
  `CLOUDFLARE_ACCOUNT_ID`. Ou brancher directement le dépôt dans le tableau de bord
  Cloudflare Pages (previews par PR + prod automatiques).
- **GitHub Pages** (`DEPLOY_TARGET=github-pages`) — définir `site` (et `base`) dans
  `astro.config.mjs`, puis Settings → Pages → Source = GitHub Actions.

> À faire avant la mise en prod : renseigner le vrai domaine dans `astro.config.mjs`
> (`site`) et `public/robots.txt`, et remplacer les liens LinkedIn `…-PLACEHOLDER`
> de `src/data/posts.json` par les vraies URLs.
