import { useEffect, useRef } from "react";

/** Elementos gráficos decorativos animados por slide (Anime.js). */
export function SlideDecor({ variant = 0 }) {
  const rootRef = useRef(null);
  const tones = [
    ["#c41e2a", "#c9a76a"],
    ["#8a1018", "#d4bc8a"],
    ["#e02332", "#a8894f"],
  ][variant % 3];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let cancelled = false;
    const cleanups = [];

    (async () => {
      const { animate, createTimeline, stagger, createSpring } = await import("animejs");
      if (cancelled) return;

      const orbs = root.querySelectorAll(".prop-orb");
      const rings = root.querySelectorAll(".prop-ring");
      const sparks = root.querySelectorAll(".prop-spark");
      const lines = root.querySelectorAll(".prop-line");

      const intro = createTimeline({ defaults: { ease: "out(3)" } })
        .add(orbs, { opacity: [0, 1], scale: [0.6, 1], duration: 800, delay: stagger(90) }, 0)
        .add(rings, { opacity: [0, 0.7], scale: [0.7, 1], duration: 900, delay: stagger(120) }, 80)
        .add(sparks, { opacity: [0, 1], scale: [0, 1], duration: 500, delay: stagger(70) }, 200)
        .add(lines, { opacity: [0, 0.45], duration: 700, delay: stagger(100) }, 160);
      cleanups.push(() => intro.revert?.() || intro.pause?.());

      orbs.forEach((orb, i) => {
        const tw = animate(orb, {
          y: i % 2 === 0 ? -16 : 12,
          x: i % 2 === 0 ? 10 : -8,
          rotate: i % 2 === 0 ? 8 : -6,
          duration: 3200 + i * 400,
          ease: "inOut(2)",
          loop: true,
          alternate: true,
        });
        cleanups.push(() => tw.revert?.() || tw.pause?.());
      });

      rings.forEach((ring, i) => {
        const tw = animate(ring, {
          rotate: i % 2 === 0 ? 360 : -360,
          duration: 26000 + i * 6000,
          ease: "linear",
          loop: true,
        });
        cleanups.push(() => tw.revert?.() || tw.pause?.());
      });

      const sparkPulse = animate(sparks, {
        opacity: [0.35, 1],
        scale: [0.85, 1.2],
        duration: 1600,
        delay: stagger(180),
        ease: createSpring({ stiffness: 90, damping: 10 }),
        loop: true,
        alternate: true,
      });
      cleanups.push(() => sparkPulse.revert?.() || sparkPulse.pause?.());
    })();

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => {
        try {
          fn();
        } catch {
          /* noop */
        }
      });
    };
  }, [variant]);

  return (
    <div className="prop-decor" ref={rootRef} aria-hidden="true">
      <span className="prop-orb prop-orb--lg" style={{ ["--orb"]: tones[0] }} />
      <span className="prop-orb prop-orb--md" style={{ ["--orb"]: tones[1] }} />
      <span className="prop-orb prop-orb--sm" style={{ ["--orb"]: tones[0] }} />
      <span className="prop-ring prop-ring--a" />
      <span className="prop-ring prop-ring--b" />
      <span className="prop-spark prop-spark--1" />
      <span className="prop-spark prop-spark--2" />
      <span className="prop-spark prop-spark--3" />
      <span className="prop-line prop-line--h" />
      <span className="prop-line prop-line--v" />
    </div>
  );
}
