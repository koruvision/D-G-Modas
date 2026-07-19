import { useVisualMotion, track } from "./useVisualMotion.js";

const ORBIT = [
  { t: "Loja", a: -90 },
  { t: "Ads", a: -30 },
  { t: "CRM", a: 30 },
  { t: "Social", a: 90 },
  { t: "Posts", a: 150 },
  { t: "Bling", a: 210 },
];

export function ClosingOrbitVisual() {
  const rootRef = useVisualMotion(({ animate, createTimeline, stagger, utils, root }) => {
    const cleanups = [];
    const nodes = root.querySelectorAll(".cov-node");
    const ring = root.querySelector(".cov-ring");
    const cta = root.querySelector(".cov-cta");
    const hub = root.querySelector(".cov-hub");

    utils.set(nodes, { opacity: 0, scale: 0.5 });
    track(
      cleanups,
      createTimeline({ defaults: { ease: "out(3)" } })
        .add(hub, { scale: [0.5, 1], opacity: [0, 1], duration: 700 }, 0)
        .add(ring, { opacity: [0, 1], scale: [0.8, 1], duration: 800 }, 100)
        .add(nodes, { opacity: 1, scale: 1, duration: 500, delay: stagger(60) }, 250)
        .add(cta, { opacity: [0, 1], y: [12, 0], duration: 500 }, 500)
    );

    track(cleanups, animate(ring, { rotate: 360, duration: 28000, ease: "linear", loop: true }));
    track(cleanups, animate(hub, { scale: [1, 1.08, 1], duration: 2200, ease: "inOut(2)", loop: true }));
    track(
      cleanups,
      animate(cta, {
        scale: [1, 1.05, 1],
        duration: 1800,
        ease: "inOut(2)",
        loop: true,
      })
    );

    return () => cleanups.forEach((fn) => fn());
  });

  const cx = 260;
  const cy = 170;
  const r = 110;

  return (
    <div className="slide-visual cov" ref={rootRef} data-visual-root>
      <svg className="slide-visual__svg" viewBox="0 0 520 360">
        <circle
          className="cov-ring"
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#c9a76a"
          strokeWidth="1.2"
          strokeDasharray="6 10"
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
        <g className="cov-hub" style={{ transformOrigin: `${cx}px ${cy}px` }}>
          <circle cx={cx} cy={cy} r="40" fill="#c41e2a" />
          <text x={cx} y={cy + 5} textAnchor="middle" fill="#fff" fontSize="13" fontFamily="Outfit,sans-serif" fontWeight="600">
            KV
          </text>
        </g>
        {ORBIT.map((n) => {
          const rad = (n.a * Math.PI) / 180;
          const x = cx + Math.cos(rad) * r;
          const y = cy + Math.sin(rad) * r;
          return (
            <g key={n.t} className="cov-node" data-wire style={{ transformOrigin: `${x}px ${y}px` }}>
              <circle cx={x} cy={y} r="22" fill="#fff" stroke="#c41e2a" strokeWidth="1.5" />
              <text x={x} y={y + 4} textAnchor="middle" fill="#141414" fontSize="10" fontFamily="Outfit,sans-serif" fontWeight="600">
                {n.t}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="cov-cta">Ecossistema completo</div>
    </div>
  );
}
