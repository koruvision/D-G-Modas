import { useEffect, useRef } from "react";
import { SECTIONS } from "./data/proposalContent.js";

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useProposalAnimations({ onActiveSection }) {
  const lenisRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const cleanups = [];

    (async () => {
      const [{ gsap, ScrollTrigger, Flip }, LenisMod, animeMod] = await Promise.all([
        import("../lib/gsapSetup.js"),
        import("lenis"),
        import("animejs"),
      ]);
      if (cancelled) return;

      const Lenis = LenisMod.default || LenisMod.Lenis;
      const anime =
        typeof animeMod.animate === "function"
          ? animeMod.animate
          : typeof animeMod.default === "function"
            ? animeMod.default
            : animeMod.default?.animate;

      const reduce = reducedMotion();

      if (!reduce && Lenis) {
        const lenis = new Lenis({
          duration: 1.15,
          smoothWheel: true,
          touchMultiplier: 1.4,
        });
        lenisRef.current = lenis;
        lenis.on("scroll", ScrollTrigger.update);
        const raf = (time) => {
          lenis.raf(time);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
        cleanups.push(() => lenis.destroy());
      }

      const root = document.querySelector(".prop-page");
      if (!root) return;

      const ctx = gsap.context(() => {
        // Hero intro
        const heroEls = root.querySelectorAll("[data-hero-el]");
        if (heroEls.length) {
          gsap.fromTo(
            heroEls,
            { y: reduce ? 0 : 36, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: reduce ? 0.01 : 0.9,
              stagger: reduce ? 0 : 0.08,
              ease: "power3.out",
              delay: 0.1,
            }
          );
        }

        // Section reveals
        root.querySelectorAll("[data-reveal]").forEach((el) => {
          gsap.fromTo(
            el,
            { y: reduce ? 0 : 40, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: reduce ? 0.01 : 0.85,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            }
          );
        });

        // Stagger groups
        root.querySelectorAll("[data-stagger]").forEach((group) => {
          const kids = group.querySelectorAll("[data-reveal]");
          if (!kids.length) return;
          gsap.fromTo(
            kids,
            { y: reduce ? 0 : 28, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: reduce ? 0.01 : 0.7,
              stagger: reduce ? 0 : 0.06,
              ease: "power2.out",
              scrollTrigger: {
                trigger: group,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        });

        // Featured plans: Flip + badge pop
        root.querySelectorAll(".prop-plan.is-featured, .prop-plan.is-accent").forEach((card) => {
          if (reduce) return;
          ScrollTrigger.create({
            trigger: card,
            start: "top 85%",
            once: true,
            onEnter: () => {
              const state = Flip.getState(card);
              card.classList.add("is-flipped-in");
              Flip.from(state, { duration: 0.7, ease: "power2.out" });
              const badge = card.querySelector(".prop-badge");
              if (badge && typeof anime === "function") {
                anime(badge, { scale: [1, 1.08, 1], duration: 900, ease: "out(3)" });
              }
            },
          });
        });

        // Carousel drag hint / horizontal snap polish
        root.querySelectorAll("[data-carousel]").forEach((carousel) => {
          const track = carousel.querySelector(".prop-carousel__track");
          if (!track) return;
          let isDown = false;
          let startX = 0;
          let scrollLeft = 0;

          const down = (e) => {
            isDown = true;
            carousel.classList.add("is-dragging");
            startX = (e.pageX || e.touches?.[0]?.pageX) - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
          };
          const up = () => {
            isDown = false;
            carousel.classList.remove("is-dragging");
          };
          const move = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = (e.pageX || e.touches?.[0]?.pageX) - carousel.offsetLeft;
            carousel.scrollLeft = scrollLeft - (x - startX) * 1.25;
          };

          carousel.addEventListener("mousedown", down);
          carousel.addEventListener("mouseleave", up);
          carousel.addEventListener("mouseup", up);
          carousel.addEventListener("mousemove", move);
          cleanups.push(() => {
            carousel.removeEventListener("mousedown", down);
            carousel.removeEventListener("mouseleave", up);
            carousel.removeEventListener("mouseup", up);
            carousel.removeEventListener("mousemove", move);
          });

          if (!reduce) {
            gsap.fromTo(
              track.children,
              { x: 24, autoAlpha: 0 },
              {
                x: 0,
                autoAlpha: 1,
                stagger: 0.08,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: carousel,
                  start: "top 80%",
                  toggleActions: "play none none none",
                },
              }
            );
          }
        });

        // Active section observer
        SECTIONS.forEach((s) => {
          const el = document.getElementById(s.id);
          if (!el) return;
          ScrollTrigger.create({
            trigger: el,
            start: "top center",
            end: "bottom center",
            onEnter: () => onActiveSection?.(s.id),
            onEnterBack: () => onActiveSection?.(s.id),
          });
        });

        // Soft pin for closing CTA feel
        const closing = document.getElementById("fechamento");
        if (closing && !reduce) {
          gsap.fromTo(
            closing.querySelectorAll(".prop-btn, .prop-triggers span"),
            { y: 20, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              stagger: 0.05,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: closing,
                start: "top 70%",
              },
            }
          );
        }
      }, root);

      ctxRef.current = ctx;
      ScrollTrigger.refresh();
    })();

    const onKey = (e) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "ArrowRight" && e.key !== "ArrowLeft")
        return;
      const ids = SECTIONS.map((s) => s.id);
      const current =
        ids.findIndex((id) => {
          const el = document.getElementById(id);
          if (!el) return false;
          const r = el.getBoundingClientRect();
          return r.top <= window.innerHeight * 0.4 && r.bottom >= window.innerHeight * 0.25;
        }) ?? 0;
      const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
      const next = Math.max(0, Math.min(ids.length - 1, current + dir));
      document.getElementById(ids[next])?.scrollIntoView({ behavior: "smooth" });
    };
    window.addEventListener("keydown", onKey);
    cleanups.push(() => window.removeEventListener("keydown", onKey));

    return () => {
      cancelled = true;
      ctxRef.current?.revert?.();
      cleanups.forEach((fn) => fn());
      lenisRef.current = null;
    };
  }, [onActiveSection]);
}
