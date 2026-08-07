/**
 * ? Contrôleur « à venir / posté » (amélioration progressive).
 *
 * ! Le site est STATIQUE : l'état calculé au build se périme dès que l'instant de parution
 * ! est franchi. Ce contrôleur le recalcule **dans le navigateur, à l'heure du visiteur**,
 * ! à partir de l'instant de parution rendu en clair dans le HTML (`data-published-at`).
 * * Le rendu serveur reste le repli sans JS : il n'est jamais faux plus longtemps qu'un déploiement.
 *
 * ? `now` est toujours injecté par l'appelant : la logique reste déterministe et testable.
 */

const SCHEDULED_MENTION = "à venir";
const PUBLISHED_MENTION = "posté";

/** Compose le nom accessible d'une carte : intitulé stable + mention d'état. */
export function cardAriaLabel(base: string, scheduled: boolean): string {
  return `${base} (${scheduled ? SCHEDULED_MENTION : PUBLISHED_MENTION})`;
}

function isScheduledAt(iso: string | undefined, now: Date): boolean | null {
  if (!iso) return null;
  const instant = Date.parse(iso);
  return Number.isNaN(instant) ? null : instant > now.getTime();
}

/**
 * Marque d'un `data-scheduled` chaque élément porteur de `data-published-at` encore à paraître,
 * et met à jour le nom accessible du lien qu'il contient (le cas échéant).
 * ! Un attribut illisible laisse l'élément intact plutôt que de deviner.
 */
function applyScheduleState(root: ParentNode, now: Date): void {
  for (const element of root.querySelectorAll<HTMLElement>("[data-published-at]")) {
    const scheduled = isScheduledAt(element.dataset.publishedAt, now);
    if (scheduled === null) continue;

    element.toggleAttribute("data-scheduled", scheduled);

    const labelled = element.querySelector<HTMLElement>("[data-aria-base]");
    const base = labelled?.dataset.ariaBase;
    if (labelled && base) {
      labelled.setAttribute("aria-label", cardAriaLabel(base, scheduled));
    }
  }
}

/**
 * Met à jour le compteur « (N à pourvoir) » de l'introduction.
 * ! Le comptage s'appuie sur les `<template>` de modale — **un par post** — et non sur les
 * ! vignettes, qui sont rendues DEUX fois (vue par rubrique + vue par date).
 */
function applyScheduledCount(root: ParentNode, now: Date): void {
  const wrapper = root.querySelector<HTMLElement>("[data-scheduled-wrapper]");
  const output = root.querySelector<HTMLElement>("[data-scheduled-count]");
  if (!wrapper || !output) return;

  let count = 0;
  for (const template of root.querySelectorAll<HTMLElement>("[data-post-at]")) {
    if (isScheduledAt(template.dataset.postAt, now) === true) count += 1;
  }

  output.textContent = String(count);
  wrapper.toggleAttribute("hidden", count === 0);
}

/**
 * Recalcule tout l'état de planification de la page.
 * @param root racine à traiter (le document en production)
 * @param now instant de référence — l'heure du navigateur en production
 */
export function initSchedule(root: ParentNode = document, now: Date = new Date()): void {
  applyScheduleState(root, now);

  // ! `template.content` est un fragment INERTE : il échappe à `root.querySelectorAll`.
  // ! Il faut donc le traiter explicitement, sinon la modale garderait l'état du build.
  for (const template of root.querySelectorAll<HTMLTemplateElement>("template[data-post-template]")) {
    applyScheduleState(template.content, now);
  }

  applyScheduledCount(root, now);
}
