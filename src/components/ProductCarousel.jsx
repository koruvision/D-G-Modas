import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "./Icon.jsx";
import { ProductCard } from "./ProductCard.jsx";

export function ProductCarousel({ products = [] }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const rootRef = useRef(null);
  const state = useRef({ index: 0, timer: null, locked: false });
  const [inView, setInView] = useState(false);

  const list = useMemo(() => products.slice(0, 8), [products]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const root = rootRef.current;
    if (!track || !root || !inView || list.length < 3) return;

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

    const maxIndex = () => Math.max(0, track.children.length - 1);

    const goTo = (i, animate = true) => {
      const max = maxIndex();
      s.index = ((i % (max + 1)) + (max + 1)) % (max + 1);
      track.style.transition = animate ? "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)" : "none";
      track.style.transform = `translate3d(${-s.index * stepWidth()}px, 0, 0)`;
    };

    const advance = (dir = 1) => {
      if (s.locked) return;
      s.locked = true;
      goTo(s.index + dir, true);
      window.setTimeout(() => {
        s.locked = false;
      }, 700);
    };

    const start = () => {
      if (reduce) return;
      stop();
      s.timer = setInterval(() => advance(1), 3600);
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
      prevBtn?.removeEventListener("click", onPrev);
      nextBtn?.removeEventListener("click", onNext);
      root.removeEventListener("mouseenter", stop);
      root.removeEventListener("mouseleave", start);
      root.removeEventListener("focusin", stop);
      root.removeEventListener("focusout", start);
      window.removeEventListener("resize", onResize);
    };
  }, [list, inView]);

  if (!list.length) return null;

  return (
    <div className="product-carousel" ref={rootRef}>
      <button type="button" className="product-carousel__nav product-carousel__nav--prev" aria-label="Anterior">
        <Icon name="chevron" />
      </button>
      <div className="product-carousel__viewport" ref={viewportRef}>
        <div className="product-carousel__track" ref={trackRef}>
          {inView
            ? list.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 2} />)
            : null}
        </div>
      </div>
      <button type="button" className="product-carousel__nav product-carousel__nav--next" aria-label="Próximo">
        <Icon name="chevron" />
      </button>
    </div>
  );
}
