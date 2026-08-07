/**
 * ? Carrousel de la modale (amélioration progressive).
 * La piste est déjà défilable nativement (scroll-snap / swipe)
 * ce contrôleur ajoute boutons précédent/suivant, points, compteur et flèches clavier, et
 * garde tout synchronisé avec la page réellement visible.
 * ! Retourne une fonction de nettoyage (à appeler à la fermeture de la modale).
 */
export function initCarousel(root: ParentNode): () => void {
  const carousel = root.querySelector<HTMLElement>("[data-carousel]");
  const track = carousel?.querySelector<HTMLElement>("[data-carousel-track]");
  if (!carousel || !track) {
    return () => {};
  }

  const slides = Array.from(track.children) as HTMLElement[];
  if (slides.length === 0) {
    return () => {};
  }

  const prev = carousel.querySelector<HTMLButtonElement>("[data-carousel-prev]");
  const next = carousel.querySelector<HTMLButtonElement>("[data-carousel-next]");
  const dots = Array.from(carousel.querySelectorAll<HTMLButtonElement>("[data-carousel-dot]"));
  const counter = carousel.querySelector<HTMLElement>("[data-carousel-counter]");

  let current = 0;

  const render = () => {
    if (counter) counter.textContent = `${current + 1} / ${slides.length}`;
    dots.forEach((dot, i) => dot.setAttribute("aria-current", i === current ? "true" : "false"));
    if (prev) prev.disabled = current === 0;
    if (next) next.disabled = current === slides.length - 1;
  };

  const goTo = (index: number) => {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides[current].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    render();
  };

  // ? Page « courante » = diapo dont le bord gauche est le plus proche de celui de la piste.
  // * Déterministe (pas de course à l'init ni pendant un défilement animé).
  const sync = () => {
    const trackLeft = track.getBoundingClientRect().left;
    let nearest = 0;
    let min = Infinity;
    slides.forEach((slide, i) => {
      const distance = Math.abs(slide.getBoundingClientRect().left - trackLeft);
      if (distance < min) {
        min = distance;
        nearest = i;
      }
    });
    if (nearest !== current) {
      current = nearest;
      render();
    }
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      sync();
    });
  };

  const onPrev = () => goTo(current - 1);
  const onNext = () => goTo(current + 1);
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      onNext();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      onPrev();
    }
  };

  prev?.addEventListener("click", onPrev);
  next?.addEventListener("click", onNext);
  track.addEventListener("keydown", onKey);
  track.addEventListener("scroll", onScroll, { passive: true });
  const dotHandlers = dots.map((dot, i) => {
    const handler = () => goTo(i);
    dot.addEventListener("click", handler);
    return handler;
  });

  render();

  return () => {
    prev?.removeEventListener("click", onPrev);
    next?.removeEventListener("click", onNext);
    track.removeEventListener("keydown", onKey);
    track.removeEventListener("scroll", onScroll);
    dots.forEach((dot, i) => dot.removeEventListener("click", dotHandlers[i]));
  };
}
