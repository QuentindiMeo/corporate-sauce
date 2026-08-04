/**
 * ? Mise en forme des dates de publication (français, charte : langue intégrale FR).
 * ! `publishedAt` vient de `posts.json` en « AAAA-MM-JJ » : Zod le coerce en Date à
 * ! MINUIT UTC. Tout formatage doit donc rester en UTC — sinon, sur un fuseau derrière
 * ! Greenwich, le 21/07 s'afficherait « 20 juillet ».
 */
const LONG_FR = new Intl.DateTimeFormat('fr-FR', {
	day: 'numeric',
	month: 'long',
	year: 'numeric',
	timeZone: 'UTC',
});

/** « 21 juillet 2026 » — libellé lisible, destiné à l'affichage. */
export function formatPublicationDate(date: Date): string {
	return LONG_FR.format(date);
}

/** « 2026-07-21 » — forme machine, pour `<time datetime>` et schema.org. */
export function toIsoDate(date: Date): string {
	return date.toISOString().slice(0, 10);
}
