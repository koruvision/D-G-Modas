import { useEffect, useRef } from "react";

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Deck horizontal: teclado, swipe e animação GSAP entre slides.
 */
export function useProposalDeck({ index, setIndex, trackRef, total }) {
  const touchRef = useRef({ x: 0, y: 0, active: false });
  const lockedRef = useRef(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        setIndex((i) => Math.min(total - 1, i + 1));
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        setIndex((i) => Math.max(0, i - 1));
      }
      if (e.key === "Home") setIndex(0);
      if (e.key === "End") setIndex(total - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setIndex, total]);

  useEffect(() => {
    const root = document.querySelector(".prop-deck");
    if (!root) return undefined;

    const onWheel = (e) => {
      if (lockedRef.current) return;
      const card = e.target.closest?.(".prop-slide__card");
      if (card && card.scrollHeight > card.clientHeight + 8) {
        const atTop = card.scrollTop <= 0;
        const atBottom = card.scrollTop + card.clientHeight >= card.scrollHeight - 2;
        if (Math.abs(e.deltaY) >= Math.abs(e.deltaX) && !e.shiftKey) {
          if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) return;
        }
      }
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      const dominant = absX > absY ? e.deltaX : e.deltaY;
      if (Math.abs(dominant) < 22) return;
      e.preventDefault();
      lockedRef.current = true;
      setIndex((i) => {
        if (dominant > 0) return Math.min(total - 1, i + 1);
        return Math.max(0, i - 1);
      });
      window.setTimeout(() => {
        lockedRef.current = false;
      }, 720);
    };

    const onTouchStart = (e) => {
      const t = e.touches[0];
      touchRef.current = { x: t.clientX, y: t.clientY, active: true };
    };
    const onTouchEnd = (e) => {
      if (!touchRef.current.active) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchRef.current.x;
      const dy = t.clientY - touchRef.current.y;
      touchRef.current.active = false;
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) setIndex((i) => Math.min(total - 1, i + 1));
      else setIndex((i) => Math.max(0, i - 1));
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchend", onTouchEnd);
    };
  }, [setIndex, total]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { gsap } = await import("../lib/gsapSetup.js");
      if (cancelled || !trackRef.current) return;
      const reduce = reducedMotion();
      const deck = trackRef.current.parentElement;
      const width = deck?.clientWidth || window.innerWidth;

      gsap.to(trackRef.current, {
        x: -index * width,
        duration: reduce ? 0.01 : 0.75,
        ease: "power3.inOut",
        overwrite: true,
      });

      const active = document.querySelector(".prop-slide.is-active .prop-slide__card");
      if (active && !reduce) {
        gsap.fromTo(
          active,
          { autoAlpha: 0.55, y: 28, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.65, ease: "power2.out" }
        );
      }
    })();

    const onResize = () => {
      if (!trackRef.current) return;
      const deck = trackRef.current.parentElement;
      const width = deck?.clientWidth || window.innerWidth;
      trackRef.current.style.transform = `translate3d(${-index * width}px, 0, 0)`;
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
  }, [index, trackRef]);
}
