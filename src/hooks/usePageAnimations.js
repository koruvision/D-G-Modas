import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/** Selectors animated on every page (entrada + scroll). */
const AUTO_SELECTORS = [
  ".reveal-lux",
  ".page-hero",
  ".section-head",
  ".cat-card",
  ".feature-card",
  ".quote-card",
  ".stat",
  ".product-card",
  ".filters",
  ".pdp__gallery",
  ".pdp__info",
  ".pdp-section",
  ".checkout-steps",
  ".checkout__main",
  ".checkout__summary",
  ".bag-mascot",
  ".empty-state",
  ".compare-table-wrap",
  ".cta-band__content",
  ".about-grid > *",
  ".footer__brand",
  ".footer__col",
  ".footer__payments",
];

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function collectTargets(scope) {
  const seen = new Set();
  const list = [];
  AUTO_SELECTORS.forEach((sel) => {
    scope.querySelectorAll(sel).forEach((el) => {
      if (seen.has(el) || el.closest(".hero-banners")) return;
      seen.add(el);
      list.push(el);
    });
  });
  return { list, seen };
}

function clearAnimationMarks() {
  document.querySelectorAll("[data-gsap-animated], [data-gsap-stagger]").forEach((el) => {
    delete el.dataset.gsapAnimated;
    delete el.dataset.gsapStagger;
  });
}

/**
 * Animações GSAP globais: carregadas sob demanda após o first paint.
 */
export function usePageAnimations(contentKey = 0) {
  const { pathname } = useLocation();
  const gsapRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    let cancelled = false;
    let ctx = null;
    let t1 = 0;
    let t2 = 0;

    const schedule =
      window.requestIdleCallback || ((cb) => window.setTimeout(cb, 100));
    const cancelSchedule =
      window.cancelIdleCallback || ((id) => window.clearTimeout(id));

    const idleId = schedule(async () => {
      const mod = await import("../lib/gsapSetup.js");
      if (cancelled) return;
      const { gsap, ScrollTrigger } = mod;
      gsapRef.current = mod;

      function revealElement(el, { immediate = false } = {}) {
        const from = { y: 36, autoAlpha: 0, scale: 0.985 };
        const to = {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.85,
          ease: "power3.out",
          overwrite: "auto",
        };
        if (immediate) {
          gsap.fromTo(el, from, { ...to, delay: 0.05 });
          return;
        }
        gsap.fromTo(el, from, {
          ...to,
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            once: true,
            toggleActions: "play none none none",
          },
        });
      }

      function runScrollReveals() {
        const { list, seen } = collectTargets(document);
        document.querySelectorAll(".reveal-stagger").forEach((parent) => {
          if (parent.dataset.gsapStagger === "1") return;
          const kids = [...parent.children].filter((c) => c.dataset.gsapAnimated !== "1");
          if (!kids.length) return;
          parent.dataset.gsapStagger = "1";
          kids.forEach((k) => {
            seen.add(k);
            k.dataset.gsapAnimated = "1";
          });
          gsap.fromTo(
            kids,
            { y: 32, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.75,
              stagger: 0.09,
              ease: "power2.out",
              scrollTrigger: {
                trigger: parent,
                start: "top 90%",
                once: true,
              },
            }
          );
        });

        list.forEach((el) => {
          if (el.dataset.gsapAnimated === "1") return;
          el.dataset.gsapAnimated = "1";
          const rect = el.getBoundingClientRect();
          const inView = rect.top < window.innerHeight * 0.95 && rect.bottom > 0;
          revealElement(el, { immediate: inView });
        });
        ScrollTrigger.refresh();
      }

      gsapRef.current.runScrollReveals = runScrollReveals;

      const main = document.querySelector("main") || document.body;
      clearAnimationMarks();
      ctx = gsap.context(() => {
        gsap.from(".site-header", {
          y: -18,
          autoAlpha: 0,
          duration: 0.55,
          ease: "power2.out",
        });
        gsap.from(".header__top-msg", {
          y: -8,
          autoAlpha: 0,
          duration: 0.45,
          delay: 0.12,
          ease: "power2.out",
        });
        const heroContent = main.querySelector(".hero-banner.is-active .hero-banner__content");
        if (heroContent) {
          gsap.from(heroContent.children, {
            y: 40,
            autoAlpha: 0,
            duration: 0.9,
            stagger: 0.11,
            delay: 0.18,
            ease: "power3.out",
          });
        }
        gsap.from(".whatsapp-float", {
          scale: 0.6,
          autoAlpha: 0,
          duration: 0.65,
          delay: 0.7,
          ease: "back.out(1.7)",
        });
        runScrollReveals();
      }, document.documentElement);

      t1 = window.setTimeout(() => runScrollReveals(), 150);
      t2 = window.setTimeout(() => runScrollReveals(), 600);
    });

    return () => {
      cancelled = true;
      cancelSchedule(idleId);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      clearAnimationMarks();
      ctx?.revert();
      gsapRef.current = null;
    };
  }, [pathname]);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !contentKey) return undefined;
    const t = window.setTimeout(() => {
      gsapRef.current?.runScrollReveals?.();
    }, 40);
    return () => window.clearTimeout(t);
  }, [contentKey, pathname]);
}
