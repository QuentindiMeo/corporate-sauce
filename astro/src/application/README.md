# application — cas d'usage

Orchestre le domaine. Dépend **uniquement** de `domain/` (jamais de l'infrastructure
ni de l'UI, ni d'Astro). Reçoit les ports par injection.

- `list-posts-by-theme.ts` — construit les 7 lignes thématiques à partir d'un `PostRepository`.
- `get-post-detail.ts` — récupère un post pour la modale.

Chaque cas d'usage retourne un **view model** prêt pour la présentation. Voir `action.md` §3.
