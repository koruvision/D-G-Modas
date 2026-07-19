import { useEffect } from "react";

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Animações interativas por slide: entrada, hover magnético, orbs e micro-interações.
 */
export function useSlideInteractions(index) {
  useEffect(() => {
    if (reducedMotion()) return undefined;
    let cancelled = false;
    const cleanups = [];

    (async () => {
      const [{ gsap }, animeMod] = await Promise.all([
        import("../lib/gsapSetup.js"),
        import("animejs").catch(() => null),
      ]);
      if (cancelled) return;

      const anime =
        animeMod &&
        (typeof animeMod.animate === "function"
          ? animeMod.animate
          : typeof animeMod.default === "function"
            ? animeMod.default
            : animeMod.default?.animate);

      const slide = document.querySelector(".prop-slide.is-active");
      if (!slide) return;
      const card = slide.querySelector(".prop-slide__card");

      // Entrada em cascata dos elementos interativos
      const targets = slide.querySelectorAll(
        "[data-reveal], .prop-glass, .prop-plan, .prop-pillar, .prop-chips li, .prop-device, .prop-btn, .prop-icon-wrap, .prop-logos, .prop-triggers span"
      );
      if (targets.length) {
        gsap.fromTo(
          targets,
          { autoAlpha: 0, y: 22, scale: 0.96 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: 0.035,
            ease: "power2.out",
            delay: 0.12,
            overwrite: "auto",
          }
        );
      }

      // Orbs flutuantes
      const orbs = slide.querySelectorAll(".prop-orb");
      orbs.forEach((orb, i) => {
        const tw = gsap.to(orb, {
          y: i % 2 === 0 ? -18 : 14,
          x: i % 2 === 0 ? 12 : -10,
          rotation: i % 2 === 0 ? 8 : -6,
          duration: 3.2 + i * 0.4,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
        cleanups.push(() => tw.kill());
      });

      // Hover magnético em cards/planos/pilares
      const magnets = slide.querySelectorAll(".prop-plan, .prop-pillar, .prop-glass, .prop-chips li, .prop-btn");
      magnets.forEach((el) => {
        const onMove = (e) => {
          const r = el.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
          const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
          gsap.to(el, {
            x: dx * 6,
            y: dy * 5,
            rotateX: dy * -4,
            rotateY: dx * 5,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        };
        const onLeave = () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: "power3.out",
            overwrite: "auto",
          });
        };
        const onEnter = () => {
          if (typeof anime === "function") {
            anime(el, { scale: [1, 1.03, 1], duration: 480, ease: "out(3)" });
          } else {
            gsap.fromTo(el, { scale: 1 }, { scale: 1.03, duration: 0.2, yoyo: true, repeat: 1 });
          }
          const ico = el.querySelector(".prop-icon-wrap, .prop-chip__ico, .prop-plan__ico, .icon");
          if (ico) {
            gsap.fromTo(
              ico,
              { rotate: 0, scale: 1 },
              { rotate: 12, scale: 1.15, duration: 0.35, yoyo: true, repeat: 1, ease: "power2.out" }
            );
          }
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        el.addEventListener("pointerenter", onEnter);
        cleanups.push(() => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
          el.removeEventListener("pointerenter", onEnter);
          gsap.set(el, { clearProps: "transform" });
        });
      });

      // Parallax leve no card com o mouse
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

      // Device frames: zoom suave no hover
      slide.querySelectorAll(".prop-device").forEach((device) => {
        const onEnter = () => gsap.to(device, { y: -8, scale: 1.02, duration: 0.4, ease: "power2.out" });
        const onLeave = () => gsap.to(device, { y: 0, scale: 1, duration: 0.45, ease: "power2.out" });
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
