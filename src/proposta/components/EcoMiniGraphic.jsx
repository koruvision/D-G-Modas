import { useEffect, useId, useRef } from "react";

const NODES = [
  { id: "a", label: "Loja", x: 200, y: 42 },
  { id: "b", label: "Ads", x: 340, y: 110 },
  { id: "c", label: "CRM", x: 300, y: 230 },
  { id: "d", label: "Social", x: 100, y: 230 },
  { id: "e", label: "ERP", x: 60, y: 110 },
];

/** Mini mapa do ecossistema (Anime.js drawable + stagger + hover). */
export function EcoMiniGraphic() {
  const rootRef = useRef(null);
  const uid = useId().replace(/:/g, "");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let cancelled = false;
    const cleanups = [];

    (async () => {
      const { animate, createTimeline, createDrawable, stagger } = await import("animejs");
      if (cancelled) return;

      const paths = root.querySelectorAll(".emg-path");
      const nodes = root.querySelectorAll(".emg-node");
      const hub = root.querySelector(".emg-hub");

      const drawable = createDrawable(root.querySelectorAll(".emg-path"), 0, 0);
      const tl = createTimeline({ defaults: { ease: "out(3)" } })
        .add(hub, { scale: [0.6, 1], opacity: [0, 1], duration: 700 }, 0)
        .add(drawable, { draw: ["0 0", "0 1"], duration: 1100, delay: stagger(80), ease: "inOut(3)" }, 100)
        .add(nodes, { opacity: [0, 1], scale: [0.5, 1], duration: 520, delay: stagger(70) }, 350);
      cleanups.push(() => tl.revert?.() || tl.pause?.());

      const pulse = animate(hub, {
        scale: [1, 1.06, 1],
        duration: 2400,
        ease: "inOut(2)",
        loop: true,
      });
      cleanups.push(() => pulse.revert?.() || pulse.pause?.());

      nodes.forEach((node) => {
        const enter = () =>
          animate(node, { scale: 1.16, duration: 320, ease: "out(4)" });
        const leave = () => animate(node, { scale: 1, duration: 360, ease: "out(2)" });
        node.addEventListener("pointerenter", enter);
        node.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          node.removeEventListener("pointerenter", enter);
          node.removeEventListener("pointerleave", leave);
        });
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
  }, []);

  const stroke = `url(#${uid}-s)`;

  return (
    <div className="emg" ref={rootRef} aria-label="Mapa animado do ecossistema">
      <svg className="emg__svg" viewBox="0 0 400 280">
        <defs>
          <linearGradient id={`${uid}-s`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c41e2a" />
            <stop offset="100%" stopColor="#c9a76a" />
          </linearGradient>
        </defs>
        {NODES.map((n) => (
          <path
            key={`p-${n.id}`}
            className="emg-path"
            d={`M200 140 L${n.x} ${n.y}`}
            fill="none"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}
        <g className="emg-hub" style={{ transformOrigin: "200px 140px" }}>
          <circle cx="200" cy="140" r="34" fill="#c41e2a" />
          <text x="200" y="145" textAnchor="middle" fill="#faf7f4" fontSize="12" fontFamily="Outfit, sans-serif" fontWeight="600">
            Hub
          </text>
        </g>
        {NODES.map((n) => (
          <g key={n.id} className="emg-node" style={{ transformOrigin: `${n.x}px ${n.y}px`, cursor: "pointer" }}>
            <circle cx={n.x} cy={n.y} r="20" fill="#fff" stroke={stroke} strokeWidth="2" />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fill="#141414" fontSize="10" fontFamily="Outfit, sans-serif" fontWeight="600">
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
