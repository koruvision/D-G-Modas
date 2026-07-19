import { useVisualMotion, track } from "./useVisualMotion.js";

const BLOCKS = [
  { id: "loja", label: "Loja", x: 40, y: 40 },
  { id: "ads", label: "Ads", x: 200, y: 40 },
  { id: "social", label: "Social", x: 360, y: 40 },
  { id: "crm", label: "CRM", x: 40, y: 160 },
  { id: "posts", label: "Posts", x: 200, y: 160 },
  { id: "bling", label: "Bling", x: 360, y: 160 },
];

export function ComboBuilderVisual() {
  const rootRef = useVisualMotion(({ animate, createTimeline, stagger, utils, root }) => {
    const cleanups = [];
    const blocks = root.querySelectorAll(".cbv-block");
    const pack = root.querySelector(".cbv-pack");
    const links = root.querySelectorAll(".cbv-link");

    utils.set(blocks, { opacity: 0, scale: 0.7 });
    utils.set(pack, { opacity: 0, scale: 0.85 });

    track(
      cleanups,
      createTimeline({ defaults: { ease: "out(4)" } })
        .add(blocks, { opacity: 1, scale: 1, duration: 520, delay: stagger(70) }, 0)
        .add(links, { opacity: [0, 0.7], duration: 500, delay: stagger(40) }, 350)
        .add(pack, { opacity: 1, scale: 1, duration: 600 }, 550)
    );

    track(
      cleanups,
      animate(blocks, {
        y: stagger([-4, 4]),
        duration: 2400,
        delay: stagger(100),
        ease: "inOut(2)",
        loop: true,
        alternate: true,
      })
    );

        track(
          cleanups,
          animate(pack, {
            scale: [1, 1.04, 1],
            duration: 2200,
            ease: "inOut(2)",
            loop: true,
          })
        );

    return () => cleanups.forEach((fn) => fn());
  });

  return (
    <div className="slide-visual cbv" ref={rootRef} data-visual-root>
      <svg className="slide-visual__svg" viewBox="0 0 520 340">
        {BLOCKS.map((b) => (
          <g key={b.id} className="cbv-block" data-wire style={{ transformOrigin: `${b.x + 50}px ${b.y + 30}px` }}>
            <rect x={b.x} y={b.y} width="100" height="60" rx="12" fill="#fff" stroke="#c9a76a" strokeWidth="1.5" />
            <text x={b.x + 50} y={b.y + 36} textAnchor="middle" fill="#141414" fontSize="12" fontFamily="Outfit,sans-serif" fontWeight="600">
              {b.label}
            </text>
          </g>
        ))}
        <path className="cbv-link" d="M90 100 L90 230" fill="none" stroke="#c41e2a" strokeWidth="1.5" strokeDasharray="4 4" opacity="0" />
        <path className="cbv-link" d="M250 100 L250 230" fill="none" stroke="#c41e2a" strokeWidth="1.5" strokeDasharray="4 4" opacity="0" />
        <path className="cbv-link" d="M410 100 L410 230" fill="none" stroke="#c41e2a" strokeWidth="1.5" strokeDasharray="4 4" opacity="0" />
        <g className="cbv-pack" style={{ transformOrigin: "260px 270px" }}>
          <rect x="140" y="240" width="240" height="56" rx="16" fill="#c41e2a" />
          <text x="260" y="274" textAnchor="middle" fill="#faf7f4" fontSize="14" fontFamily="Outfit,sans-serif" fontWeight="600">
            Combo completo
          </text>
        </g>
      </svg>
    </div>
  );
}
