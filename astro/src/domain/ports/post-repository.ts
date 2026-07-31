import type { Post } from '../post';

/**
 * Port (entrant) : source de posts. Implémenté par l'infrastructure
 * (Content Collections Astro, JSON, API…). Le domaine ne connaît que ce contrat.
 */
export interface PostRepository {
	listPosts(): Promise<Post[]>;
	findById(id: string): Promise<Post | null>;
}
