import { useEffect, useMemo, useRef } from "react";
import { Icon } from "./Icon.jsx";
import { ProductCard } from "./ProductCard.jsx";

/** Monta um bloco base com itens suficientes para cobrir a viewport (sem buraco). */
function buildUnit(products) {
  const base = products.filter(Boolean).slice(0, 12);
  if (!base.length) return [];
  const unit = [...base];
  // Garante pelo menos 6 slides no bloco (preenche 4 colunas + overflow)
  while (unit.length < 6) {
    unit.push(...base);
  }
  return unit;
}

export function ProductCarousel({ products = [] }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const rootRef = useRef(null);
  const state = useRef({
    index: 0,
    unitLen: 0,
    timer: null,
    locked: false,
    step: 280,
  });

  const unit = useMemo(() => buildUnit(products), [products]);
  const unitLen = unit.length;

  // Três cópias coladas: [...A][...A][...A] — o meio é a faixa “real”
  const slides = useMemo(() => {
    if (!unitLen) return [];
    return [...unit, ...unit, ...unit];
  }, [unit, unitLen]);

  useEffect(() => {
    const track = trackRef.current;
    const root = rootRef.current;
    const viewport = viewportRef.current;
    if (!track || !root || !viewport || unitLen < 1) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = state.current;
    s.unitLen = unitLen;
    s.locked = false;
    // Começa no bloco do meio
    s.index = unitLen;

    const measure = () => {
      const card = track.querySelector(".product-card");
      if (!card) return 280;
      const styles = getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || "20") || 20;
      return card.getBoundingClientRect().width + gap;
    };

    const apply = (animate) => {
      s.step = measure();
      track.style.transition = animate ? "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)" : "none";
      track.style.transform = `translate3d(${-s.index * s.step}px, 0, 0)`;
    };

    const normalize = () => {
      // Se saiu do bloco do meio, salta sem animação para o equivalente
      if (s.index >= s.unitLen * 2) {
        s.index -= s.unitLen;
        apply(false);
      } else if (s.index < s.unitLen) {
        s.index += s.unitLen;
        apply(false);
      }
    };

    const advance = (dir = 1) => {
      if (s.locked) return;
      s.locked = true;
      s.index += dir;
      apply(true);
      window.setTimeout(() => {
        normalize();
        s.locked = false;
      }, 680);
    };

    const start = () => {
      if (reduce) return;
      stop();
      s.timer = window.setInterval(() => advance(1), 3200);
    };
    const stop = () => {
      if (s.timer) window.clearInterval(s.timer);
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
    const onResize = () => apply(false);

    const prevBtn = root.querySelector(".product-carousel__nav--prev");
    const nextBtn = root.querySelector(".product-carousel__nav--next");
    prevBtn?.addEventListener("click", onPrev);
    nextBtn?.addEventListener("click", onNext);
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);
    window.addEventListener("resize", onResize, { passive: true });

    // Recalcula após layout (imagens/fontes)
    apply(false);
    const raf = requestAnimationFrame(() => apply(false));
    start();

    return () => {
      cancelAnimationFrame(raf);
      stop();
      prevBtn?.removeEventListener("click", onPrev);
      nextBtn?.removeEventListener("click", onNext);
      root.removeEventListener("mouseenter", stop);
      root.removeEventListener("mouseleave", start);
      root.removeEventListener("focusin", stop);
      root.removeEventListener("focusout", start);
      window.removeEventListener("resize", onResize);
      track.style.transform = "";
      track.style.transition = "";
    };
  }, [unitLen, slides.length]);

  if (!unitLen) return null;

  return (
    <div className="product-carousel" ref={rootRef}>
      <button type="button" className="product-carousel__nav product-carousel__nav--prev" aria-label="Anterior">
        <Icon name="chevron" />
      </button>
      <div className="product-carousel__viewport" ref={viewportRef}>
        <div className="product-carousel__track" ref={trackRef}>
          {slides.map((p, i) => (
            <ProductCard key={`${p.id}-${i}`} product={p} priority={i >= unitLen && i < unitLen + 2} />
          ))}
        </div>
      </div>
      <button type="button" className="product-carousel__nav product-carousel__nav--next" aria-label="Próximo">
        <Icon name="chevron" />
      </button>
    </div>
  );
}
