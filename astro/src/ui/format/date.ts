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

// ? « 21 juillet 2026 » — libellé lisible, destiné à l'affichage.
export function formatPublicationDate(date: Date): string {
	return LONG_FR.format(date);
}

const MONTH_FR = new Intl.DateTimeFormat('fr-FR', {
	month: 'long',
	year: 'numeric',
	timeZone: 'UTC',
});

// ? « août 2026 » — intertitre des groupes de la vue chronologique.
export function formatMonth(date: Date): string {
	return MONTH_FR.format(date);
}

/**
 * ? « 08.26 » — code court visible dans le rail des mois.
 * @param monthKey clé `AAAA-MM` produite par le domaine (`MonthRow.monthKey`).
 */
export function formatMonthCode(monthKey: string): string {
	const [year, month] = monthKey.split('-');
	return `${month}.${year.slice(2)}`;
}

/**
 * ? « d'août 2026 » / « de juillet 2026 » — mois précédé de sa préposition élidée, pour les phrases des noms accessibles (« Aller au mois … »).
 * * Les seuls mois français à initiale vocalique sont avril, août et octobre.
 */
export function formatMonthWithElision(date: Date): string {
	const label = formatMonth(date);
	const elides = /^[aeiouâàéèêîôûù]/i.test(label);
	return `${elides ? "d'" : 'de '}${label}`;
}

// ? « 2026-07-21 » — forme machine, pour `<time datetime>` et schema.org.
export function toIsoDate(date: Date): string {
	return date.toISOString().slice(0, 10);
}
