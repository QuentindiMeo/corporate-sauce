import { PUBLICATION_TIME_ZONE } from "@domain/publication-time";

/**
 * ? Mise en forme des dates de publication (français, charte : langue intégrale FR).
 *
 * ! Deux natures d'entrée, deux fuseaux — ne pas les confondre :
 * !  • `publishedAt` est un **instant réel** (11 h, heure de Paris) → on le lit dans le fuseau
 * !    de publication. Le jour de parution est un fait PARISIEN, pas une propriété du lecteur :
 * !    il ne doit donc ni glisser selon le fuseau du visiteur, ni selon celui du serveur.
 * !  • `MonthRow.month` est un **repère construit** à minuit UTC par le domaine → il se lit en UTC.
 */
const LONG_FR = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: PUBLICATION_TIME_ZONE,
});

// ? « 21 juillet 2026 » — libellé lisible, destiné à l'affichage.
export function formatPublicationDate(date: Date): string {
  return LONG_FR.format(date);
}

const ISO_DAY_PARIS = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: PUBLICATION_TIME_ZONE,
});

// ? Repère de mois construit à minuit UTC par `groupByMonth` → lecture en UTC (cf. en-tête).
const MONTH_FR = new Intl.DateTimeFormat("fr-FR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
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
  const [year, month] = monthKey.split("-");
  return `${month}.${year.slice(2)}`;
}

/**
 * ? « d'août 2026 » / « de juillet 2026 » — mois précédé de sa préposition élidée, pour les phrases des noms accessibles (« Aller au mois … »).
 * * Les seuls mois français à initiale vocalique sont avril, août et octobre.
 */
export function formatMonthWithElision(date: Date): string {
  const label = formatMonth(date);
  const elides = /^[aeiouâàéèêîôûù]/i.test(label);
  return `${elides ? "d'" : "de "}${label}`;
}

/**
 * ? « 2026-07-21 » — forme machine, pour `<time datetime>` et schema.org.
 * ! Doit désigner le MÊME jour que `formatPublicationDate`, donc le jour parisien.
 * ! `toISOString().slice(0,10)` donnait le jour UTC : faux pour tout instant du soir.
 * * `en-CA` produit nativement « AAAA-MM-JJ ».
 */
export function toIsoDate(date: Date): string {
  return ISO_DAY_PARIS.format(date);
}
