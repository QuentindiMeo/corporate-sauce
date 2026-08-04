# domain — cœur du hexagone

Entités, value objects et **ports** (interfaces). **Zéro dépendance framework**
(pas d'`astro`, pas de `zod`, pas d'accès I/O). Tout ce qui est ici est testable en isolation.

- `post.ts` — entité `Post` + value objects (`Category`, `Mode`, `LinkedInUrl`).
- `post-collection.ts` — regroupement en lignes thématiques (`groupByTheme`), tri, filtrage.
- `ports/post-repository.ts` — port entrant : `listPosts()`, `findById()`.

Règle de dépendance : rien dans `domain/` n'importe `application/`, `infrastructure/` ou l'UI.
Voir `action.md` §3.
