import type { ImageMetadata } from 'astro';

import {
	formatMonth,
	formatMonthCode,
	formatMonthWithElision,
	formatPublicationDate,
	toIsoDate,
} from '@/ui/format/date';
import { styleFromMode } from '@/ui/theme/modes';
import type { Category } from '@domain/category';
import { isDarkMode, type Mode } from '@domain/mode';
import { isCarousel, isScheduledAt, type Post } from '@domain/post';
import type { MonthRow, ThemeRow } from '@domain/post-collection';

/**
 * ? **Mapper de la couche de présentation**
 *
 * * Architecture assumée : **Ports & Adapters**. La présentation *est* l'adaptateur primaire — c'est donc à elle de projeter
 * * les entités, et il n'existe **aucun port sortant** dans le domaine pour cela (pas de `post-presenter` : le domaine ne connaît pas ses vues).
 *
 * ! Ce module est le SEUL de `components/` et `pages/` à importer le domaine. Les composants ne reçoivent plus que des
 * ! view models : ils ne calculent plus rien, n'appellent plus aucune règle métier, et ne forcent plus aucun typage.
 *
 * ! RÈGLE ABSOLUE — aucune valeur dérivée de l'instant présent dans un view model. Le site est statique : un booléen « à venir »
 * ! y serait figé au build. Le view model porte le FAIT (`publishedAtIso`) ; le verdict se calcule à part,
 * ! avec {@link isScheduledNow}, côté serveur pour le repli comme côté client à l'heure du visiteur.
 */

// ? Une page de carrousel, prête pour `<Image>`.
export interface PostPageViewModel {
	readonly image: ImageMetadata;
	readonly alt: string;
}

export interface PostViewModel {
	readonly id: string;
	readonly category: Category;
	readonly mode: Mode;

	readonly isDarkMode: boolean; // ? `true` si le fond du mode est sombre — pilote `color-scheme` de la vignette
	readonly modeStyle: string; // ? Variables CSS inline de la palette du post
	readonly headerStyle: string; // ? Palette **inversée**, pour la bande de titre de la vignette

	readonly title: string;
	readonly subtitle?: string;
	readonly body: string;
	readonly takeaway?: string;
	readonly cta?: string;
	readonly hashtags: readonly string[];

	readonly image: ImageMetadata;
	readonly imageAlt: string;
	readonly linkedInUrl: string;

	readonly isCarousel: boolean;
	readonly pages: readonly PostPageViewModel[];
	readonly pageCount: number;

	readonly publishedAtIso: string; // ? Instant de parution complet (ISO), sérialisé pour le contrôleur client
	readonly publishedDayIso: string; // ? Jour parisien de parution, pour `<time datetime>` et schema.org
	readonly publishedLabel: string; // ? « 5 août 2026 » — libellé lisible

	readonly ariaBase: string; // ? Intitulé du lien, **sans** mention d'état (celle-ci dépend de l'heure)
	readonly ariaDescription?: string; // ? Complément accessible d'un carrousel (« Contient 7 pages. »)
}

export interface ThemeRowViewModel {
	readonly category: Category;
	readonly posts: readonly PostViewModel[];
}

export interface MonthRowViewModel {
	readonly monthKey: string;
	readonly label: string; // ? « août 2026 » — intertitre du groupe
	readonly code: string; // ? « 08.26 » — code court du rail latéral
	readonly labelWithElision: string; // ? « d'août 2026 » — pour les noms accessibles du rail
	readonly count: number;
	readonly posts: readonly PostViewModel[];
}

export function toPostViewModel(post: Post<ImageMetadata>): PostViewModel {
	const carousel = isCarousel(post);
	const pages = (post.pages ?? []).map((page) => ({ image: page.image, alt: page.alt }));
	const shape = carousel ? 'carrousel' : 'post';
	const aria = {
		base: `Ouvrir le ${shape} « ${post.title} »`,
		description: carousel
			? `Contient ${pages.length} page${pages.length > 1 ? 's' : ''}.`
			: undefined,
	};

	return {
		id: post.id,
		category: post.category,
		mode: post.mode,

		isDarkMode: isDarkMode(post.mode),
		modeStyle: styleFromMode(post.mode),
		headerStyle: styleFromMode(post.mode === 'clair' ? 'sombre' : 'clair'), // ? La bande de titre prend la palette opposée, pour détacher le texte du visuel.

		title: post.title,
		subtitle: post.subtitle,
		body: post.body,
		takeaway: post.takeaway,
		cta: post.cta,
		hashtags: post.hashtags ?? [],

		image: post.image,
		imageAlt: post.imageAlt,
		linkedInUrl: post.linkedInUrl,

		isCarousel: carousel,
		pages,
		pageCount: pages.length,

		publishedAtIso: post.publishedAt.toISOString(),
		publishedDayIso: toIsoDate(post.publishedAt),
		publishedLabel: formatPublicationDate(post.publishedAt),

		ariaBase: aria.base,
		ariaDescription: aria.description,
	};
}

export function toThemeRowViewModels(
	rows: readonly ThemeRow<ImageMetadata>[],
): ThemeRowViewModel[] {
	return rows.map((row) => ({
		category: row.category,
		posts: row.posts.map(toPostViewModel),
	}));
}

export function toMonthRowViewModels(
	rows: readonly MonthRow<ImageMetadata>[],
): MonthRowViewModel[] {
	return rows.map((row) => ({
		monthKey: row.monthKey,
		label: formatMonth(row.month),
		code: formatMonthCode(row.monthKey),
		labelWithElision: formatMonthWithElision(row.month),
		count: row.posts.length,
		posts: row.posts.map(toPostViewModel),
	}));
}

/**
 * ? Verdict « encore à paraître ? » — **délibérément hors du view model**.
 * * Délègue au domaine (`isScheduledAt`) : une seule encodage de la règle, appliquée ici à
 * * l'instant porté par le view model.
 * @param now instant de référence — le build pour le repli, le navigateur en production.
 */
export function isScheduledNow(post: PostViewModel, now: Date): boolean {
	return isScheduledAt(new Date(post.publishedAtIso), now);
}
