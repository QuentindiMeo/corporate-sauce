# QDM — Galerie des posts LinkedIn

Site vitrine des posts LinkedIn de **QDM — _Question. Design. Materialize._**  
Galerie de vignettes regroupées par thème ou par date.  
Français, responsive, accessible (WCAG AA), minimaliste.  
Construit avec **Astro** en **architecture hexagonale** et développé en **TDD**.

## Structure du dépôt

```tree
.
├─ astro/                 ← l'application (tout le code vit ici)
│  ├─ src/                domain · application · infrastructure · UI (Astro)
│  ├─ tests/              unit · integration · e2e
│  ├─ README.md           doc détaillée du projet
│  └─ package.json
├─ .github/workflows/     ci.yml (porte de qualité) · deploy.yml
├─ lighthouserc.json      seuils Lighthouse (perf/a11y/best-practices/seo ≥ 0,95)
├─ action.md              plan de développement & suivi des 7 phases
└─ plan.md                spécification d'origine
```

## Prérequis

- **Node ≥ 22.12** (le build échoue sous une version antérieure).
- **pnpm** (ne pas utiliser npm). voir `packageManager` dans `astro/package.json` — `corepack` le fournit automatiquement.

```sh
nvm use 22        # ou toute version ≥ 22.12 (ex. via nvm/fnm)
corepack enable   # active le bon pnpm depuis packageManager
```

## Démarrage rapide

```sh
cd astro
pnpm install      # installe les dépendances
pnpm dev          # http://localhost:4321
```

Build de production + prévisualisation :

```sh
pnpm build        # génère le site statique dans astro/dist/
pnpm preview      # sert le build sur http://localhost:4321
```

## Commandes (depuis `astro/`)

| Commande          | Effet                                             |
| ----------------- | ------------------------------------------------- |
| `pnpm dev`        | Serveur de développement                          |
| `pnpm build`      | Build statique (`dist/`)                          |
| `pnpm preview`    | Sert le build                                     |
| `pnpm test`       | Tests unitaires & intégration (Vitest)            |
| `pnpm test:watch` | Vitest en continu (boucle TDD)                    |
| `pnpm coverage`   | Couverture (seuil ≥ 90 % sur le cœur hexagonal)   |
| `pnpm test:e2e`   | Tests end-to-end (Playwright + axe-core)          |
| `pnpm lint`       | ESLint                                            |
| `pnpm typecheck`  | `astro check`                                     |
| `pnpm check`      | Porte de qualité locale : lint + typecheck + test |

Avant la première exécution e2e en local : `pnpm exec playwright install chromium`.

## Les deux vues de la galerie

La même galerie s'affiche de deux façons, commutables par le bouton de vue de l'en-tête — il porte
l'icône et le libellé de la **vue affichée** (« Par rubrique » ou « Par date »), et le clic bascule :

| Vue                       | Agencement                                                       | Tri                                 |
| ------------------------- | ---------------------------------------------------------------- | ----------------------------------- |
| **Par rubrique** (défaut) | une ligne par rubrique (PERF, A11Y, DX, UI, ARCHI, HTML, COLLAB) | `order` puis `id`                   |
| **Par date**              | flux unique, un groupe par mois (« AOÛT 2026 »)                  | `publishedAt` décroissant puis `id` |

Le choix est mémorisé dans le cache du navigateur.

> Le site étant **statique**, la chronologie et les pastilles « à venir » se figent à l'instant du build :
> un post programmé ne devient « paru » qu'au prochain déploiement.

## Mettre à jour le contenu (sans redéployer de code)

L'identité des posts vit dans **`astro/src/data/posts.json`** — pas dans le code.  
Pour ajouter un post : déposer le(s) visuel(s) dans `astro/src/assets/posts/` (un PNG portrait,
ou un dossier `carrousel-XX/` pour un carrousel), puis ajouter une entrée JSON (`category`, `mode`, `title`, `body`,
`hashtags`, `image`, `imageAlt`, `linkedInUrl`, `publishedAt`, `order`, et `pages[]` pour un carrousel).  
Le schéma (`astro/src/content.config.ts`) valide chaque entrée au build.  
Détails, exemples (post simple & carrousel) : **[`astro/README.md`](astro/README.md)**.

## Méthodologie — TDD

Rouge → vert → refactor.  
Le test qui échoue s'écrit d'abord, puis le code minimal pour le faire passer, puis on nettoie/refactor.  
Le cœur (domain/application) se teste sans framework ; l'UI via la Container API d'Astro ; les parcours via Playwright.

## Intégration continue & déploiement

- **CI** (`.github/workflows/ci.yml`) : `lint → typecheck → test → e2e → build`, bloquant, sur chaque push/PR.  
  Un job Lighthouse (non bloquant) audite perf/a11y/SEO.
- **Déploiement** (`.github/workflows/deploy.yml`) : piloté par la variable de dépôt `DEPLOY_TARGET` — `cloudflare`
  (Cloudflare Pages, secrets `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID`) ou `github-pages`.  
  Voir `astro/README.md` pour la mise en place.

## À faire avant la mise en production

1. Renseigner le **domaine réel** dans `astro/astro.config.mjs` (`site`) et `astro/public/robots.txt` (actuellement `example.com`).
2. Remplacer les **liens LinkedIn `…-PLACEHOLDER`** de `astro/src/data/posts.json` par les vraies URLs
   (actuellement **19 sur 19**).
3. Choisir la cible de déploiement (`DEPLOY_TARGET`) et calibrer les seuils Lighthouse sur un premier run réel.
4. Si la chronologie doit rester juste sans intervention, planifier un **build périodique** (cron
   Cloudflare Pages ou GitHub Actions) : voir l'encadré « site statique » plus haut.

## Dépannage

- **`astro` échoue / erreurs de syntaxe** : vérifier `node -v` ≥ 22.12.
- **CI « No pnpm version is specified »** : `pnpm/action-setup` doit recevoir un `version`
  explicite (l'action s'exécute à la racine, où il n'y a pas de `package.json`).
- **WSL / lecteur Windows monté** : un `pnpm install` peut échouer avec `EACCES` lors d'un
  `rename` ; relancer la commande suffit généralement (le store est déjà peuplé).
