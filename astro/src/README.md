# Architecture (hexagonale / clean)

```tree
src/
├─ domain/            cœur — entités, value objects, ports (zéro framework)
├─ application/       cas d'usage — dépend uniquement de domain/
├─ infrastructure/    adaptateurs sortants — Astro/JSON/LinkedIn (implémentent les ports)
├─ pages/      ┐
├─ layouts/    │      adaptateur de PRÉSENTATION (couche UI).
├─ components/ │      Emplacements imposés par Astro pour le routing/rendu ;
├─ styles/     ┘      ils constituent l'« ui » du plan (action.md §3).
├─ assets/            images optimisées (astro:assets)
└─ content.config.ts  collection Content Collections
```

**Règle de dépendance** : `pages/components → application → domain` ;
`infrastructure → domain`. Le domaine n'importe jamais Astro.

> Le plan (`action.md` §3) illustre un dossier `ui/`. En pratique, Astro fixe
> l'emplacement de `pages/`, `layouts/`, `components/`, `styles/` : ces dossiers
> **sont** la couche UI. Le cœur hexagonal reste isolé dans `domain/`,
> `application/`, `infrastructure/`.

Alias TypeScript : `@domain/*`, `@application/*`, `@infrastructure/*`, `@/*` → `src/*`.
