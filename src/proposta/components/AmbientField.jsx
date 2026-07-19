import { useEffect, useRef } from "react";

/** Campo de partículas / grid animado (Anime.js stagger + timeline). */
export function AmbientField({ count = 36 }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let cancelled = false;
    const cleanups = [];

    (async () => {
      const { animate, createTimeline, stagger } = await import("animejs");
      if (cancelled) return;

      const cells = root.querySelectorAll(".af-cell");
      const arcs = root.querySelectorAll(".af-arc");

      const intro = createTimeline({ defaults: { ease: "out(3)" } }).add(cells, {
        opacity: [0, 0.55],
        scale: [0.4, 1],
        duration: 900,
        delay: stagger(18, { grid: [6, 6], from: "center" }),
      });
      cleanups.push(() => intro.revert?.() || intro.pause?.());

      const pulse = animate(cells, {
        opacity: stagger([0.15, 0.7]),
        scale: stagger([0.65, 1.2]),
        duration: 2400,
        delay: stagger(40, { grid: [6, 6], from: "center" }),
        ease: "inOut(2)",
        loop: true,
        alternate: true,
      });
      cleanups.push(() => pulse.revert?.() || pulse.pause?.());

      arcs.forEach((arc, i) => {
        const tw = animate(arc, {
          rotate: i % 2 === 0 ? 360 : -360,
          duration: 18000 + i * 4000,
          ease: "linear",
          loop: true,
        });
        cleanups.push(() => tw.revert?.() || tw.pause?.());
      });
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
  }, [count]);

  const cells = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="af" ref={rootRef} aria-hidden="true">
      <svg className="af__svg" viewBox="0 0 240 240">
        <circle className="af-arc" cx="120" cy="120" r="88" fill="none" stroke="rgba(196,30,42,0.22)" strokeWidth="1" strokeDasharray="4 10" style={{ transformOrigin: "120px 120px" }} />
        <circle className="af-arc" cx="120" cy="120" r="64" fill="none" stroke="rgba(201,167,106,0.28)" strokeWidth="1" strokeDasharray="2 8" style={{ transformOrigin: "120px 120px" }} />
        {cells.map((i) => {
          const col = i % 6;
          const row = Math.floor(i / 6);
          const x = 30 + col * 36;
          const y = 30 + row * 36;
          return <circle key={i} className="af-cell" cx={x} cy={y} r="2.4" fill={i % 3 === 0 ? "#c41e2a" : "#c9a76a"} />;
        })}
      </svg>
    </div>
  );
}
