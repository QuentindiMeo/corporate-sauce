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

	const closeButton = dialog.querySelector<HTMLElement>('[data-modal-close]');
	const triggers = Array.from(root.querySelectorAll<HTMLElement>('[data-post-id]'));
	let lastTrigger: HTMLElement | null = null;

	function open(event: Event): void {
		const target = event.currentTarget as HTMLElement;
		const id = target.dataset.postId;
		if (!id) return;
		const template = root.querySelector<HTMLTemplateElement>(
			`template[data-post-template="${id}"]`,
		);
		if (!template) return;

		event.preventDefault();
		body!.replaceChildren(template.content.cloneNode(true));
		lastTrigger = target;
		dialog!.showModal();
	}

	function close(): void {
		dialog!.close();
	}

	// Clic sur l'arrière-plan (::backdrop, hors de la boîte du dialog) → fermeture.
	// On teste la position vs le rectangle du dialog (robuste tous navigateurs) ;
	// `target === dialog` couvre le cas des environnements sans layout (tests).
	function onDialogClick(event: MouseEvent): void {
		const rect = dialog!.getBoundingClientRect();
		const outsideBox =
			rect.width > 0 &&
			(event.clientX < rect.left ||
				event.clientX > rect.right ||
				event.clientY < rect.top ||
				event.clientY > rect.bottom);
		if (outsideBox || event.target === dialog) {
			close();
		}
	}

	function onClose(): void {
		body!.replaceChildren();
		lastTrigger?.focus();
		lastTrigger = null;
	}

	for (const trigger of triggers) {
		trigger.addEventListener('click', open);
	}
	closeButton?.addEventListener('click', close);
	dialog.addEventListener('click', onDialogClick);
	dialog.addEventListener('close', onClose);

	return () => {
		for (const trigger of triggers) {
			trigger.removeEventListener('click', open);
		}
		closeButton?.removeEventListener('click', close);
		dialog.removeEventListener('click', onDialogClick);
		dialog.removeEventListener('close', onClose);
	};
}
