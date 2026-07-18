import { useEffect, useMemo, useRef } from "react";
import { Icon } from "./Icon.jsx";
import { ProductCard } from "./ProductCard.jsx";

export function ProductCarousel({ products = [] }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const rootRef = useRef(null);
  const state = useRef({ index: 0, timer: null, locked: false });

  const list = useMemo(() => products.slice(0, 12), [products]);
  const doubled = useMemo(() => (list.length >= 4 ? [...list, ...list] : list), [list]);

  useEffect(() => {
    const track = trackRef.current;
    const root = rootRef.current;
    if (!track || !root || list.length < 4) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = state.current;
    s.index = 0;
    s.locked = false;

    const stepWidth = () => {
      const card = track.querySelector(".product-card");
      if (!card) return 280;
      const styles = getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || "20") || 20;
      return card.getBoundingClientRect().width + gap;
    };

    const halfCount = () => Math.floor(track.children.length / 2);

    const goTo = (i, animate = true) => {
      s.index = i;
      track.style.transition = animate ? "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)" : "none";
      track.style.transform = `translate3d(${-i * stepWidth()}px, 0, 0)`;
    };

    const advance = (dir = 1) => {
      if (s.locked) return;
      s.locked = true;
      goTo(s.index + dir, true);
    };

    const onTransitionEnd = () => {
      const half = halfCount();
      if (s.index >= half) goTo(s.index - half, false);
      else if (s.index < 0) goTo(s.index + half, false);
      s.locked = false;
    };

    const start = () => {
      if (reduce) return;
      stop();
      s.timer = setInterval(() => advance(1), 3200);
    };
    const stop = () => {
      if (s.timer) clearInterval(s.timer);
      s.timer = null;
    };

    const onPrev = () => {
      advance(-1);
      start();
    };
    const onNext = () => {
      advance(1);
      start();
    };
    const onResize = () => goTo(s.index, false);

    track.addEventListener("transitionend", onTransitionEnd);
    const prevBtn = root.querySelector(".product-carousel__nav--prev");
    const nextBtn = root.querySelector(".product-carousel__nav--next");
    prevBtn?.addEventListener("click", onPrev);
    nextBtn?.addEventListener("click", onNext);
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);
    window.addEventListener("resize", onResize, { passive: true });

    goTo(0, false);
    start();

    return () => {
      stop();
      track.removeEventListener("transitionend", onTransitionEnd);
      prevBtn?.removeEventListener("click", onPrev);
      nextBtn?.removeEventListener("click", onNext);
      root.removeEventListener("mouseenter", stop);
      root.removeEventListener("mouseleave", start);
      root.removeEventListener("focusin", stop);
      root.removeEventListener("focusout", start);
      window.removeEventListener("resize", onResize);
    };
  }, [list]);

  if (!list.length) return null;

  return (
    <div className="product-carousel" ref={rootRef}>
      <button type="button" className="product-carousel__nav product-carousel__nav--prev" aria-label="Anterior">
        <Icon name="chevron" />
      </button>
      <div className="product-carousel__viewport" ref={viewportRef}>
        <div className="product-carousel__track" ref={trackRef}>
          {doubled.map((p, i) => (
            <ProductCard key={`${p.id}-${i}`} product={p} />
          ))}
        </div>
      </div>
      <button type="button" className="product-carousel__nav product-carousel__nav--next" aria-label="Próximo">
        <Icon name="chevron" />
      </button>
    </div>
  );
}
