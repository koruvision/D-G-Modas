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
      // Cards em carrossel horizontal somem se GSAP aplicar autoAlpha:0 fora do eixo Y
      if (el.closest(".product-carousel")) return;
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
 * Animações GSAP: só após scroll ou idle longo — fora do caminho crítico do LCP.
 */
export function usePageAnimations(contentKey = 0) {
  const { pathname } = useLocation();
  const apiRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;
    let cancelled = false;
    let ctx = null;
    let t1 = 0;
    let t2 = 0;
    let started = false;

    const boot = async () => {
      if (cancelled || started) return;
      started = true;
      const { gsap, ScrollTrigger } = await import("../lib/gsapSetup.js");
      if (cancelled) return;

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

      apiRef.current = { gsap, ScrollTrigger, runScrollReveals };

      clearAnimationMarks();
      ctx = gsap.context(() => {
        gsap.from(".whatsapp-float", {
          scale: 0.6,
          autoAlpha: 0,
          duration: 0.65,
          delay: 0.2,
          ease: "back.out(1.7)",
        });
        runScrollReveals();
      }, document.documentElement);

      t1 = window.setTimeout(() => runScrollReveals(), 150);
      t2 = window.setTimeout(() => runScrollReveals(), 600);
    };

    const onScroll = () => {
      window.removeEventListener("scroll", onScroll);
      boot();
    };
    window.addEventListener("scroll", onScroll, { passive: true, once: true });
    const fallback = window.setTimeout(boot, 4500);

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(fallback);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      clearAnimationMarks();
      ctx?.revert();
      apiRef.current = null;
    };
  }, [pathname]);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !contentKey) return undefined;
    const t = window.setTimeout(() => {
      apiRef.current?.runScrollReveals?.();
    }, 40);
    return () => window.clearTimeout(t);
  }, [contentKey, pathname]);
}
