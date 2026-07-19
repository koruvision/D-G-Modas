import { useVisualMotion, track } from "./useVisualMotion.js";

const NODES = [
  { id: "ecom", label: "Loja", x: 260, y: 42 },
  { id: "cat", label: "Catálogo", x: 400, y: 100 },
  { id: "lp", label: "Landing", x: 430, y: 220 },
  { id: "soc", label: "Social", x: 340, y: 320 },
  { id: "post", label: "Posts", x: 180, y: 320 },
  { id: "ads", label: "Ads", x: 90, y: 220 },
  { id: "bling", label: "Bling", x: 120, y: 100 },
  { id: "crm", label: "CRM", x: 260, y: 380 },
];

/** Hub completo com 8 pilares */
export function EcosystemFullVisual() {
  const rootRef = useVisualMotion(({ animate, createTimeline, createDrawable, stagger, utils, root }) => {
    const cleanups = [];
    const paths = root.querySelectorAll(".efv-path");
    const nodes = root.querySelectorAll(".efv-node");
    const hub = root.querySelector(".efv-hub");
    const drawable = createDrawable(paths, 0, 0);

    utils.set(nodes, { opacity: 0, scale: 0.5 });

    track(
      cleanups,
      createTimeline({ defaults: { ease: "out(3)" } })
        .add(hub, { scale: [0.6, 1], opacity: [0, 1], duration: 700 }, 0)
        .add(drawable, { draw: ["0 0", "0 1"], duration: 1200, delay: stagger(55), ease: "inOut(3)" }, 80)
        .add(nodes, { opacity: 1, scale: 1, duration: 520, delay: stagger(50, { from: "center" }) }, 350)
    );

    track(
      cleanups,
      animate(hub, { scale: [1, 1.06, 1], duration: 2600, ease: "inOut(2)", loop: true })
    );

    nodes.forEach((n) => {
      const enter = () => animate(n, { scale: 1.14, duration: 280, ease: "out(4)" });
      const leave = () => animate(n, { scale: 1, duration: 320, ease: "out(2)" });
      n.addEventListener("pointerenter", enter);
      n.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        n.removeEventListener("pointerenter", enter);
        n.removeEventListener("pointerleave", leave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  });

  return (
    <div className="slide-visual efv" ref={rootRef} data-visual-root aria-label="Ecossistema completo">
      <svg className="slide-visual__svg" viewBox="0 0 520 430">
        <defs>
          <linearGradient id="efv-g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c41e2a" />
            <stop offset="100%" stopColor="#c9a76a" />
          </linearGradient>
        </defs>
        {NODES.map((n) => (
          <path
            key={`p-${n.id}`}
            className="efv-path"
            d={`M260 200 L${n.x} ${n.y}`}
            fill="none"
            stroke="url(#efv-g)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}
        <g className="efv-hub" style={{ transformOrigin: "260px 200px" }}>
          <circle cx="260" cy="200" r="44" fill="#c41e2a" />
          <circle cx="260" cy="200" r="44" fill="none" stroke="#c9a76a" strokeWidth="2" opacity="0.5" />
          <text x="260" y="206" textAnchor="middle" fill="#faf7f4" fontSize="13" fontFamily="Outfit,sans-serif" fontWeight="600">
            Hub KV
          </text>
        </g>
        {NODES.map((n) => (
          <g key={n.id} className="efv-node" data-wire style={{ transformOrigin: `${n.x}px ${n.y}px`, cursor: "pointer" }}>
            <circle cx={n.x} cy={n.y} r="26" fill="#fff" stroke="url(#efv-g)" strokeWidth="2" />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fill="#141414" fontSize="10" fontFamily="Outfit,sans-serif" fontWeight="600">
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
