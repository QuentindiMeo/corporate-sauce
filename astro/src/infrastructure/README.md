# infrastructure — adaptateurs sortants

Implémente les **ports** du domaine. C'est la seule couche autorisée à connaître
Astro, Zod, le système de fichiers ou le réseau.

- `content/astro-post-repository.ts` — implémente `PostRepository` via `getCollection()`.
- `json/json-post-source.ts` — lecture de `src/data/posts.json` (ou API REST plus tard).
- `linkedin/linkedin-link.ts` — validation/normalisation des URLs LinkedIn.

Dépend de `domain/` (pour implémenter ses interfaces), jamais l'inverse. Voir `action.md` §3.
