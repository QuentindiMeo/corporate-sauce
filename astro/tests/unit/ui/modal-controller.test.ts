// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from "vitest";
import { initModal } from "@/ui/modal/modal-controller";

// happy-dom n'implémente pas showModal/close du <dialog> : on les simule.
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function () {
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
  document.body.innerHTML = `
		<a href="https://www.linkedin.com/posts/qdm_p1" data-post-id="p1" id="card-1">carte 1</a>
		<a href="https://www.linkedin.com/posts/qdm_p2" data-post-id="p2" id="card-2">carte 2</a>
		<template data-post-template="p1"><article data-mode="clair"><h2>Titre P1</h2></article></template>
		<template data-post-template="p2"><article data-mode="sombre"><h2>Titre P2</h2></article></template>
		<dialog data-post-modal>
			<button type="button" data-modal-close>Fermer</button>
			<div data-modal-body></div>
		</dialog>`;
});

function elements() {
  return {
    dialog: document.querySelector("[data-post-modal]") as HTMLDialogElement,
    body: document.querySelector("[data-modal-body]") as HTMLElement,
    card1: document.querySelector("#card-1") as HTMLAnchorElement,
    closeButton: document.querySelector("[data-modal-close]") as HTMLButtonElement,
  };
}

describe("Feature: post modal controller", () => {
  it("Given a card, When it is clicked, Then the modal opens with the clicked post content", () => {
    initModal(document);
    const { dialog, body, card1 } = elements();

    card1.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

    expect(dialog.open).toBe(true);
    expect(body.textContent).toContain("Titre P1");
    expect(body.querySelector('[data-mode="clair"]')).not.toBeNull();
  });

  it("Given a card link, When it is clicked, Then the default navigation is prevented (progressive enhancement)", () => {
    initModal(document);
    const { card1 } = elements();

    const evt = new MouseEvent("click", { bubbles: true, cancelable: true });
    card1.dispatchEvent(evt);

    expect(evt.defaultPrevented).toBe(true);
  });

  it("Given an open modal, When the close button is clicked, Then the modal closes and focus returns to the card", () => {
    initModal(document);
    const { dialog, card1, closeButton, body } = elements();

    card1.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    closeButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(dialog.open).toBe(false);
    expect(body.childElementCount).toBe(0);
    expect(document.activeElement).toBe(card1);
  });

  it("Given an open modal, When the backdrop is clicked, Then the modal closes", () => {
    initModal(document);
    const { dialog, card1 } = elements();

    card1.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    dialog.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(dialog.open).toBe(false);
  });

  it("Given a card with no matching template, When it is clicked, Then nothing opens", () => {
    document.querySelector('[data-post-template="p1"]')?.remove();
    initModal(document);
    const { dialog, card1 } = elements();

    card1.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

    expect(dialog.open).toBe(false);
  });
});
