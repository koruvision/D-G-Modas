import { useEffect, useRef } from "react";

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Deck horizontal: setas, teclado e swipe touch (celular/tablet).
 */
export function useProposalDeck({ index, setIndex, trackRef, total }) {
  const touchRef = useRef({
    x: 0,
    y: 0,
    active: false,
    locked: null, // "x" | "y" | null
    startIndex: 0,
  });
  const lockedRef = useRef(false);
  const indexRef = useRef(index);
  indexRef.current = index;

  const go = (dir) => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setIndex((i) => {
      if (dir > 0) return Math.min(total - 1, i + 1);
      return Math.max(0, i - 1);
    });
    window.setTimeout(() => {
      lockedRef.current = false;
    }, 680);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        go(1);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        go(-1);
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
      go(dominant > 0 ? 1 : -1);
    };

    const getPoint = (e) => {
      if (e.touches?.[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      if (e.changedTouches?.[0]) {
        return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    };

    const onPointerDown = (e) => {
      // Só touch/pen — mouse usa setas/wheel
      if (e.pointerType === "mouse") return;
      const p = getPoint(e);
      touchRef.current = {
        x: p.x,
        y: p.y,
        active: true,
        locked: null,
        startIndex: indexRef.current,
      };
    };

    const onPointerMove = (e) => {
      const t = touchRef.current;
      if (!t.active || !trackRef.current) return;
      const p = getPoint(e);
      const dx = p.x - t.x;
      const dy = p.y - t.y;

      if (!t.locked) {
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
        t.locked = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
      }

      if (t.locked === "y") return;

      // Swipe horizontal: segue o dedo um pouco
      e.preventDefault();
      const deck = trackRef.current.parentElement;
      const width = deck?.clientWidth || window.innerWidth;
      const base = -t.startIndex * width;
      const drag = Math.max(-width * 0.35, Math.min(width * 0.35, dx));
      trackRef.current.style.transition = "none";
      trackRef.current.style.transform = `translate3d(${base + drag}px, 0, 0)`;
    };

    const finishSwipe = (e) => {
      const t = touchRef.current;
      if (!t.active) return;
      const p = getPoint(e);
      const dx = p.x - t.x;
      const dy = p.y - t.y;
      const wasX = t.locked === "x" || (t.locked == null && Math.abs(dx) > Math.abs(dy));
      t.active = false;
      t.locked = null;

      if (!wasX) {
        // Restaura posição se foi scroll vertical
        const deck = trackRef.current?.parentElement;
        const width = deck?.clientWidth || window.innerWidth;
        if (trackRef.current) {
          trackRef.current.style.transition = "";
          trackRef.current.style.transform = `translate3d(${-indexRef.current * width}px, 0, 0)`;
        }
        return;
      }

      const threshold = Math.min(72, (window.innerWidth || 360) * 0.14);
      if (Math.abs(dx) >= threshold) {
        if (dx < 0) go(1);
        else go(-1);
      } else if (trackRef.current) {
        const deck = trackRef.current.parentElement;
        const width = deck?.clientWidth || window.innerWidth;
        trackRef.current.style.transition = "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)";
        trackRef.current.style.transform = `translate3d(${-indexRef.current * width}px, 0, 0)`;
      }
    };

    // Touch nativo (iOS/Android)
    const onTouchStart = (e) => {
      const p = e.touches[0];
      touchRef.current = {
        x: p.clientX,
        y: p.clientY,
        active: true,
        locked: null,
        startIndex: indexRef.current,
      };
    };
    const onTouchMove = (e) => {
      const t = touchRef.current;
      if (!t.active || !trackRef.current) return;
      const p = e.touches[0];
      const dx = p.clientX - t.x;
      const dy = p.clientY - t.y;
      if (!t.locked) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        t.locked = Math.abs(dx) >= Math.abs(dy) * 0.85 ? "x" : "y";
      }
      if (t.locked !== "x") return;

      // Se começou em card com scroll vertical e movimento misto, libera Y
      const card = e.target.closest?.(".prop-slide__card");
      if (card && card.scrollHeight > card.clientHeight + 8 && Math.abs(dy) > Math.abs(dx) * 1.2) {
        t.locked = "y";
        return;
      }

      e.preventDefault();
      const deck = trackRef.current.parentElement;
      const width = deck?.clientWidth || window.innerWidth;
      const base = -t.startIndex * width;
      const drag = Math.max(-width * 0.4, Math.min(width * 0.4, dx));
      trackRef.current.style.transition = "none";
      trackRef.current.style.transform = `translate3d(${base + drag}px, 0, 0)`;
    };
    const onTouchEnd = (e) => finishSwipe(e);

    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: false });
    root.addEventListener("touchend", onTouchEnd, { passive: true });
    root.addEventListener("pointerdown", onPointerDown, { passive: true });
    root.addEventListener("pointermove", onPointerMove, { passive: false });
    root.addEventListener("pointerup", finishSwipe, { passive: true });
    root.addEventListener("pointercancel", finishSwipe, { passive: true });

    return () => {
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchmove", onTouchMove);
      root.removeEventListener("touchend", onTouchEnd);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", finishSwipe);
      root.removeEventListener("pointercancel", finishSwipe);
    };
  }, [setIndex, total, trackRef]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { gsap } = await import("../lib/gsapSetup.js");
      if (cancelled || !trackRef.current) return;
      const reduce = reducedMotion();
      const deck = trackRef.current.parentElement;
      const width = deck?.clientWidth || window.innerWidth;

      // Limpa inline transition do drag touch
      trackRef.current.style.transition = "";

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
