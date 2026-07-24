# Galerie QDM

Site vitrine des posts LinkedIn de **QDM — _Question. Design. Materialize._**
Galerie de vignettes (une par post) regroupées par thème ; survol qui grossit et
incline la vignette ; clic → modale (visuel HD + texte complet + lien LinkedIn).
Français, responsive, accessible (WCAG AA), minimaliste.

Plan de développement complet et suivi des phases : [`../action.md`](../action.md).

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

| Commande            | Effet                                              |
| ------------------- | -------------------------------------------------- |
| `pnpm install`      | Installe les dépendances                           |
| `pnpm dev`          | Serveur de développement                           |
| `pnpm build`        | Build statique dans `dist/`                        |
| `pnpm preview`      | Sert le build                                      |
| `pnpm test`         | Tests unitaires & intégration (Vitest)             |
| `pnpm test:watch`   | Vitest en continu (boucle TDD)                     |
| `pnpm coverage`     | Couverture (seuil ≥ 90 % sur le cœur)              |
| `pnpm test:e2e`     | Tests end-to-end (Playwright + axe)                |
| `pnpm lint`         | ESLint                                             |
| `pnpm typecheck`    | `astro check`                                      |
| `pnpm check`        | Porte de qualité : lint + typecheck + test         |

Avant toute e2e locale : `pnpm exec playwright install chromium`.

## Ajouter ou modifier un post (sans redéployer de code)

Le contenu vit dans **`src/data/posts.json`** — pas dans le code. Pour ajouter un post :

1. Déposer le visuel (PNG 1080×1350) dans `src/assets/posts/`.
2. Ajouter une entrée dans `src/data/posts.json` :

   ```json
   {
     "id": "11-perf-cache",
     "rubrique": "PERF",
     "mode": "sombre",
     "titre": "…",
     "accroche": "…",
     "corps": "…",
     "takeaway": "… (optionnel)",
     "cta": "… (optionnel)",
     "image": "../assets/posts/11-perf-cache.png",
     "imageAlt": "Description accessible du visuel (obligatoire)",
     "lienLinkedIn": "https://www.linkedin.com/posts/…",
     "datePublication": "2026-07-24",
     "ordre": 3
   }
   ```

   - `rubrique` ∈ `PERF · A11Y · DX · UI · ARCHI · HTML · COLLAB` (détermine la ligne).
   - `mode` ∈ `sombre · clair · liant` (palette de la charte appliquée à la vignette et la modale).
   - `ordre` = position dans sa ligne thématique.
   - `lienLinkedIn` **doit** être une URL `https://…linkedin.com/…` (validée par le domaine).

Le schéma (`src/content.config.ts`) valide chaque entrée au build.

## Architecture (hexagonale)

```
src/
├─ domain/            entités, value objects, ports (zéro dépendance framework)
├─ application/       cas d'usage (dépend de domain/)
├─ infrastructure/    adaptateurs (Content Collections → domain)
├─ components/        UI Astro (grille, vignette, modale, primitives charte)
├─ ui/theme|modal|seo logique UI testable (tokens, thème, modale, JSON-LD)
├─ pages/  layouts/  styles/   présentation
├─ assets/posts/      visuels optimisés
└─ data/posts.json    source de contenu
```

Règle de dépendance : `pages/components → application → domain` ; `infrastructure → domain`.
Le domaine n'importe jamais Astro (garde-fou ESLint dans `eslint.config.js`).

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
