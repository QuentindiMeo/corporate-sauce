/**
 * Contrôleur de la modale de post (amélioration progressive).
 * Intercepte le clic sur les cartes (`[data-post-id]`), injecte dans le `<dialog>`
 * le contenu pré-rendu (`<template data-post-template="…">`), ouvre en modal et
 * restaure le focus sur la carte à la fermeture. Le `<dialog>` natif fournit le
 * piégeage du focus, la fermeture par `Échap` et l'arrière-plan inerte.
 */
export function initModal(root: ParentNode = document): () => void {
	const dialog = root.querySelector<HTMLDialogElement>('[data-post-modal]');
	const body = dialog?.querySelector<HTMLElement>('[data-modal-body]');
	if (!dialog || !body) {
		return () => {};
	}

	const boutonFermer = dialog.querySelector<HTMLElement>('[data-modal-close]');
	const declencheurs = Array.from(root.querySelectorAll<HTMLElement>('[data-post-id]'));
	let dernierDeclencheur: HTMLElement | null = null;

	function ouvrir(evenement: Event): void {
		const cible = evenement.currentTarget as HTMLElement;
		const id = cible.dataset.postId;
		if (!id) return;
		const template = root.querySelector<HTMLTemplateElement>(
			`template[data-post-template="${id}"]`,
		);
		if (!template) return;

		evenement.preventDefault();
		body!.replaceChildren(template.content.cloneNode(true));
		dernierDeclencheur = cible;
		dialog!.showModal();
	}

	function fermer(): void {
		dialog!.close();
	}

	// Clic sur l'arrière-plan (::backdrop, hors de la boîte du dialog) → fermeture.
	// On teste la position vs le rectangle du dialog (robuste tous navigateurs) ;
	// `target === dialog` couvre le cas des environnements sans layout (tests).
	function auClicDialog(evenement: MouseEvent): void {
		const rect = dialog!.getBoundingClientRect();
		const horsBoite =
			rect.width > 0 &&
			(evenement.clientX < rect.left ||
				evenement.clientX > rect.right ||
				evenement.clientY < rect.top ||
				evenement.clientY > rect.bottom);
		if (horsBoite || evenement.target === dialog) {
			fermer();
		}
	}

	function auClose(): void {
		body!.replaceChildren();
		dernierDeclencheur?.focus();
		dernierDeclencheur = null;
	}

	for (const declencheur of declencheurs) {
		declencheur.addEventListener('click', ouvrir);
	}
	boutonFermer?.addEventListener('click', fermer);
	dialog.addEventListener('click', auClicDialog);
	dialog.addEventListener('close', auClose);

	return () => {
		for (const declencheur of declencheurs) {
			declencheur.removeEventListener('click', ouvrir);
		}
		boutonFermer?.removeEventListener('click', fermer);
		dialog.removeEventListener('click', auClicDialog);
		dialog.removeEventListener('close', auClose);
	};
}
