/**
 * Orquestra intro + loops Anime.js/GSAP só enquanto o slide está ativo.
 * Retorna { rootRef, ready } — o efeito interno observa [data-visual-root] no ref.
 */
import { useEffect, useRef } from "react";

export function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * @param {object} opts
 * @param {(api: { animate: Function, createTimeline: Function, createDrawable: Function, stagger: Function, morphTo: Function, createMotionPath: Function, scrambleText: Function, utils: object, gsap: object, root: HTMLElement }) => (void|(() => void)|Promise<void|(() => void)>)} opts.setup
 * @param {unknown[]} [opts.deps]
 */
export function useVisualMotion(setup, deps = []) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof setup !== "function") return undefined;

    const slide = root.closest(".prop-slide");
    const isActive = () => !slide || slide.classList.contains("is-active");

    let cancelled = false;
    let cleanupFn;
    const cleanups = [];

    const run = async () => {
      if (!isActive()) return;
      const [{ animate, createTimeline, createDrawable, stagger, morphTo, createMotionPath, scrambleText, utils }, { gsap }] =
        await Promise.all([import("animejs"), import("../../lib/gsapSetup.js")]);
      if (cancelled || !isActive()) return;

      if (reducedMotion()) {
        root.querySelectorAll("[data-wire]").forEach((el) => {
          el.style.opacity = "1";
        });
        return;
      }

      const result = await setup({
        animate,
        createTimeline,
        createDrawable,
        stagger,
        morphTo,
        createMotionPath,
        scrambleText,
        utils,
        gsap,
        root,
      });
      if (typeof result === "function") cleanupFn = result;
    };

    run();

    const mo = slide
      ? new MutationObserver(() => {
          if (!isActive() && cleanupFn) {
            try {
              cleanupFn();
            } catch {
              /* noop */
            }
            cleanupFn = undefined;
          } else if (isActive() && !cleanupFn && !cancelled) {
            run();
          }
        })
      : null;
    mo?.observe(slide, { attributes: true, attributeFilter: ["class"] });

    return () => {
      cancelled = true;
      mo?.disconnect();
      try {
        cleanupFn?.();
      } catch {
        /* noop */
      }
      cleanups.forEach((fn) => {
        try {
          fn();
        } catch {
          /* noop */
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return rootRef;
}

/** Helper para empilhar cleanups de timelines/tweens */
export function track(cleanups, anim) {
  if (!anim) return anim;
  cleanups.push(() => {
    try {
      anim.revert?.() || anim.pause?.() || anim.kill?.();
    } catch {
      /* noop */
    }
  });
  return anim;
}
