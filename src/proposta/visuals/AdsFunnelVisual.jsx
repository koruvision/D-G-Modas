import { useVisualMotion, track } from "./useVisualMotion.js";

export function AdsFunnelVisual() {
  const rootRef = useVisualMotion(({ animate, createTimeline, stagger, createDrawable, utils, root }) => {
    const cleanups = [];
    const stages = root.querySelectorAll(".afv-stage");
    const bars = root.querySelectorAll(".afv-bar");
    const paths = root.querySelectorAll(".afv-flow");
    const drawable = createDrawable(paths, 0, 0);

    utils.set(stages, { opacity: 0, y: 16 });
    utils.set(bars, { scaleY: 0 });

    track(
      cleanups,
      createTimeline({ defaults: { ease: "out(3)" } })
        .add(drawable, { draw: ["0 0", "0 1"], duration: 1000, ease: "inOut(3)" }, 0)
        .add(stages, { opacity: 1, y: 0, duration: 520, delay: stagger(100) }, 200)
        .add(bars, { scaleY: 1, duration: 700, delay: stagger(80), ease: "out(4)" }, 450)
    );

    track(
      cleanups,
      animate(bars, {
        scaleY: stagger([0.55, 1]),
        duration: 2200,
        delay: stagger(100),
        ease: "inOut(2)",
        loop: true,
        alternate: true,
      })
    );

    return () => cleanups.forEach((fn) => fn());
  });

  const labels = ["Meta", "Google", "Landing", "Venda"];
  const heights = [86, 68, 48, 32];

  return (
    <div className="slide-visual afv" ref={rootRef} data-visual-root>
      <svg className="slide-visual__svg" viewBox="0 0 520 300">
        <path className="afv-flow" d="M70 80 C140 80, 160 140, 230 140 S340 200, 450 200" fill="none" stroke="#c9a76a" strokeWidth="2" />
        {labels.map((l, i) => {
          const x = 50 + i * 120;
          const h = heights[i];
          return (
            <g key={l} className="afv-stage" data-wire>
              <rect
                className="afv-bar"
                x={x}
                y={240 - h}
                width="48"
                height={h}
                rx="8"
                fill={i === 3 ? "#c41e2a" : "#c9a76a"}
                opacity="0.85"
                style={{ transformOrigin: `${x + 24}px 240px` }}
              />
              <text x={x + 24} y="268" textAnchor="middle" fill="#333" fontSize="12" fontFamily="Outfit,sans-serif" fontWeight="600">
                {l}
              </text>
            </g>
          );
        })}
        <text x="260" y="36" textAnchor="middle" fill="#8a1018" fontSize="14" fontFamily="Outfit,sans-serif" fontWeight="600">
          Funil de aquisição
        </text>
      </svg>
    </div>
  );
}
