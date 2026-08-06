/**
 * ? Règle métier : un post QDM paraît à **11 h, heure de Paris**.
 * ! `posts.json` ne porte que le JOUR (« AAAA-MM-JJ »). L'instant réel dépend donc du
 * ! décalage en vigueur ce jour-là — heure d'été (CEST, +02:00) ou d'hiver (CET, +01:00).
 * ! Sans ce calcul, `z.coerce.date()` plaçait la parution à MINUIT UTC, soit 9 à 10 h trop tôt.
 *
 * Aucune dépendance framework : `Intl` est un builtin du langage, pas un adaptateur.
 */
export const PUBLICATION_HOUR = 11;
export const PUBLICATION_TIME_ZONE = 'Europe/Paris';

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const PARTS = new Intl.DateTimeFormat('en-US', {
	timeZone: PUBLICATION_TIME_ZONE,
	hour12: false,
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
});

/**
 * Décalage du fuseau de publication, en millisecondes, à l'instant donné.
 * ? Technique : on relit l'instant DANS le fuseau cible, on reconstruit un timestamp
 * ? comme si ces composantes étaient de l'UTC, et l'écart est le décalage.
 */
function zoneOffsetMs(instant: number): number {
	const parts = Object.fromEntries(
		PARTS.formatToParts(new Date(instant))
			.filter((part) => part.type !== 'literal')
			.map((part) => [part.type, Number(part.value)]),
	) as Record<string, number>;

	// `hour` vaut 24 à minuit chez certaines implémentations d'`hour12: false`.
	const asIfUtc = Date.UTC(
		parts.year,
		parts.month - 1,
		parts.day,
		parts.hour % 24,
		parts.minute,
		parts.second,
	);
	return asIfUtc - instant;
}

/**
 * Instant de parution d'un post publié le jour `day` à {@link PUBLICATION_HOUR} heure de Paris.
 *
 * ? Deux passes : la première estime le décalage à partir d'une heure murale supposée UTC,
 * ? la seconde le confirme à l'instant corrigé. Suffisant ici parce que 11 h est **loin** des
 * ? bascules d'heure (2 h ↔ 3 h du matin) : l'heure murale n'est jamais ni ambiguë ni inexistante.
 *
 * @param day jour au format `AAAA-MM-JJ`
 * @throws si `day` n'est pas un jour calendaire valide
 */
export function publicationInstant(day: string): Date {
	if (!DAY_PATTERN.test(day)) {
		throw new Error(`Jour de publication invalide : « ${day} » (attendu AAAA-MM-JJ).`);
	}

	const [year, month, dayOfMonth] = day.split('-').map(Number);
	const wallClock = Date.UTC(year, month - 1, dayOfMonth, PUBLICATION_HOUR, 0, 0);

	// Rejette les jours qui n'existent pas (2026-13-01, 2026-02-30…) : `Date.UTC` les reporte.
	const rebuilt = new Date(wallClock);
	if (
		rebuilt.getUTCFullYear() !== year ||
		rebuilt.getUTCMonth() !== month - 1 ||
		rebuilt.getUTCDate() !== dayOfMonth
	) {
		throw new Error(`Jour de publication inexistant : « ${day} ».`);
	}

	const firstGuess = wallClock - zoneOffsetMs(wallClock);
	return new Date(wallClock - zoneOffsetMs(firstGuess));
}
