import { useEffect } from "react";

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Interações por slide com Anime.js v4 (+ GSAP só no tilt 3D do card).
 * @see https://animejs.com/documentation/
 */
export function useSlideInteractions(index) {
  useEffect(() => {
    if (reducedMotion()) return undefined;
    let cancelled = false;
    const cleanups = [];

    (async () => {
      const [{ gsap }, animeMod] = await Promise.all([
        import("../lib/gsapSetup.js"),
        import("animejs"),
      ]);
      if (cancelled) return;

      const {
        animate,
        createTimeline,
        stagger,
        createSpring,
        utils,
      } = animeMod;

      const slide = document.querySelector(".prop-slide.is-active");
      if (!slide) return;
      const card = slide.querySelector(".prop-slide__card");

      const targets = slide.querySelectorAll(
        "[data-reveal], .prop-glass, .prop-plan, .prop-pillar, .prop-chips li, .prop-device, .prop-btn, .prop-icon-wrap, .prop-logos, .prop-triggers span"
      );
      if (targets.length) {
        utils.set(targets, { opacity: 0, y: 22, scale: 0.96 });
        const intro = createTimeline({ defaults: { ease: "out(3)" } }).add(targets, {
          opacity: [0, 1],
          y: [22, 0],
          scale: [0.96, 1],
          duration: 560,
          delay: stagger(32, { start: 100 }),
        });
        cleanups.push(() => intro.revert?.() || intro.pause?.());
      }

      const magnets = slide.querySelectorAll(".prop-plan, .prop-pillar, .prop-glass, .prop-chips li, .prop-btn");
      magnets.forEach((el) => {
        const onMove = (e) => {
          const r = el.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
          const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
          animate(el, {
            x: dx * 7,
            y: dy * 5,
            rotateX: dy * -5,
            rotateY: dx * 6,
            duration: 320,
            ease: "out(2)",
            composition: "blend",
          });
        };
        const onLeave = () => {
          animate(el, {
            x: 0,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            duration: 520,
            ease: createSpring({ stiffness: 120, damping: 14 }),
          });
        };
        const onEnter = () => {
          animate(el, {
            scale: [1, 1.035, 1],
            duration: 480,
            ease: "out(3)",
          });
          const ico = el.querySelector(".prop-icon-wrap, .prop-chip__ico, .prop-plan__ico, .icon");
          if (ico) {
            animate(ico, {
              rotate: [0, 14, 0],
              scale: [1, 1.18, 1],
              duration: 520,
              ease: "out(3)",
            });
          }
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        el.addEventListener("pointerenter", onEnter);
        cleanups.push(() => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
          el.removeEventListener("pointerenter", onEnter);
          utils.set(el, { x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1 });
        });
      });

      if (card) {
        const onCardMove = (e) => {
          const r = card.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
          const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
          gsap.to(card, {
            rotateY: dx * 4,
            rotateX: dy * -3,
            duration: 0.45,
            ease: "power2.out",
            overwrite: "auto",
          });
          const shine = card.querySelector(".prop-glass-liquid__shine");
          if (shine) {
            gsap.to(shine, {
              backgroundPosition: `${50 + dx * 40}% ${50 + dy * 40}%`,
              duration: 0.4,
              overwrite: "auto",
            });
          }
        };
        const onCardLeave = () => {
          gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" });
        };
        card.addEventListener("pointermove", onCardMove);
        card.addEventListener("pointerleave", onCardLeave);
        cleanups.push(() => {
          card.removeEventListener("pointermove", onCardMove);
          card.removeEventListener("pointerleave", onCardLeave);
          gsap.set(card, { clearProps: "transform" });
        });
      }

      slide.querySelectorAll(".prop-device").forEach((device) => {
        const onEnter = () =>
          animate(device, { y: -10, scale: 1.025, duration: 420, ease: "out(3)" });
        const onLeave = () =>
          animate(device, {
            y: 0,
            scale: 1,
            duration: 480,
            ease: createSpring({ stiffness: 110, damping: 12 }),
          });
        device.addEventListener("pointerenter", onEnter);
        device.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          device.removeEventListener("pointerenter", onEnter);
          device.removeEventListener("pointerleave", onLeave);
        });
      });
    })();

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, [index]);
}
