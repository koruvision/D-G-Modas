import { useVisualMotion, track } from "./useVisualMotion.js";

/** 4 apps desconectados + linhas quebradas */
export function ProblemChaosVisual() {
  const rootRef = useVisualMotion(({ animate, createTimeline, stagger, utils, root }) => {
    const cleanups = [];
    const panels = root.querySelectorAll(".pcv-panel");
    const cracks = root.querySelectorAll(".pcv-crack");
    const sparks = root.querySelectorAll(".pcv-spark");

    utils.set(panels, { opacity: 0, y: 18 });
    utils.set(cracks, { opacity: 0 });

    track(
      cleanups,
      createTimeline({ defaults: { ease: "out(3)" } })
        .add(panels, { opacity: 1, y: 0, duration: 700, delay: stagger(90) }, 0)
        .add(cracks, { opacity: [0, 0.85], duration: 500, delay: stagger(60) }, 400)
    );

    panels.forEach((p, i) => {
      track(
        cleanups,
        animate(p, {
          x: i % 2 ? [0, 4, -3, 0] : [0, -3, 5, 0],
          y: [0, -4, 2, 0],
          duration: 3200 + i * 400,
          ease: "inOut(2)",
          loop: true,
        })
      );
    });

    track(
      cleanups,
      animate(sparks, {
        opacity: [0, 1, 0],
        scale: [0.5, 1.3, 0.4],
        duration: 1400,
        delay: stagger(220),
        loop: true,
      })
    );

    return () => cleanups.forEach((fn) => fn());
  });

  const apps = [
    { t: "WhatsApp", c: "#25d366" },
    { t: "Planilha", c: "#c9a76a" },
    { t: "Instagram", c: "#c41e2a" },
    { t: "Estoque", c: "#8a1018" },
  ];

  return (
    <div className="slide-visual pcv" ref={rootRef} data-visual-root aria-hidden="true">
      <svg className="slide-visual__svg" viewBox="0 0 520 360">
        {apps.map((a, i) => {
          const x = 40 + (i % 2) * 240;
          const y = 36 + Math.floor(i / 2) * 160;
          return (
            <g key={a.t} className="pcv-panel" data-wire style={{ transformOrigin: `${x + 90}px ${y + 50}px` }}>
              <rect x={x} y={y} width="180" height="108" rx="12" fill="#fff" stroke={a.c} strokeWidth="1.5" opacity="0.95" />
              <rect x={x + 14} y={y + 16} width="40" height="40" rx="10" fill={a.c} opacity="0.2" />
              <rect x={x + 66} y={y + 22} width="90" height="10" rx="4" fill={a.c} opacity="0.55" />
              <rect x={x + 66} y={y + 40} width="70" height="8" rx="3" fill="#ddd" />
              <rect x={x + 14} y={y + 70} width="150" height="8" rx="3" fill="#eee" />
              <rect x={x + 14} y={y + 86} width="110" height="8" rx="3" fill="#f0f0f0" />
              <text x={x + 86} y={y + 30} fill="#222" fontSize="11" fontFamily="Outfit,sans-serif" fontWeight="600">
                {a.t}
              </text>
            </g>
          );
        })}
        <path className="pcv-crack" d="M210 100 L250 140 L230 180" fill="none" stroke="#c41e2a" strokeWidth="2" strokeDasharray="4 6" />
        <path className="pcv-crack" d="M270 200 L300 230 L280 270" fill="none" stroke="#c9a76a" strokeWidth="2" strokeDasharray="3 5" />
        <path className="pcv-crack" d="M200 220 L180 250" fill="none" stroke="#c41e2a" strokeWidth="1.5" strokeDasharray="2 4" />
        <circle className="pcv-spark" cx="250" cy="140" r="4" fill="#c41e2a" />
        <circle className="pcv-spark" cx="300" cy="230" r="3.5" fill="#c9a76a" />
        <circle className="pcv-spark" cx="180" cy="250" r="3" fill="#c41e2a" />
      </svg>
      <p className="slide-visual__cap">Canais soltos · dados fragmentados</p>
    </div>
  );
}
