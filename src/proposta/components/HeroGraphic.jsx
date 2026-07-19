import { useEffect, useId, useRef } from "react";

const NODES = [
  { id: "store", label: "Loja", cx: 320, cy: 78 },
  { id: "crm", label: "CRM", cx: 478, cy: 160 },
  { id: "ads", label: "Ads", cx: 458, cy: 318 },
  { id: "social", label: "Social", cx: 320, cy: 402 },
  { id: "bling", label: "Bling", cx: 182, cy: 318 },
  { id: "lp", label: "LP", cx: 162, cy: 160 },
];

const DOTS = Array.from({ length: 28 }, (_, i) => {
  const a = (i / 28) * Math.PI * 2;
  const r = 52 + (i % 5) * 28;
  return {
    id: `d${i}`,
    x: 320 + Math.cos(a) * r,
    y: 240 + Math.sin(a) * (r * 0.72),
    s: 1.4 + (i % 3) * 0.7,
  };
});

/**
 * Ecossistema animado com Anime.js v4:
 * Timeline · stagger · createDrawable · morphTo · createMotionPath · createDraggable · createSpring · hover
 * @see https://animejs.com/documentation/
 */
export function HeroGraphic() {
  const rootRef = useRef(null);
  const uid = useId().replace(/:/g, "");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups = [];
    let cancelled = false;

    (async () => {
      const {
        animate,
        createTimeline,
        createDrawable,
        createMotionPath,
        createDraggable,
        createSpring,
        morphTo,
        stagger,
        utils,
      } = await import("animejs");
      if (cancelled) return;

      const paths = root.querySelectorAll(".hg-path");
      const nodes = root.querySelectorAll(".hg-node");
      const dots = root.querySelectorAll(".hg-dot");
      const sparks = root.querySelectorAll(".hg-spark");
      const ring = root.querySelector(".hg-ring");
      const ringB = root.querySelector(".hg-ring-b");
      const center = root.querySelector(".hg-center-shape");
      const morphTarget = root.querySelector(".hg-morph-target");
      const hub = root.querySelector(".hg-hub");
      const pulse = root.querySelector(".hg-hub-pulse");
      const pulse2 = root.querySelector(".hg-hub-pulse-2");
      const hint = root.querySelector(".hg__hint");

      if (reduce) {
        utils.set(paths, { opacity: 0.75 });
        utils.set(nodes, { opacity: 1, scale: 1 });
        utils.set(dots, { opacity: 0.35 });
        return;
      }

      utils.set(nodes, { opacity: 0, scale: 0.55 });
      utils.set(dots, { opacity: 0, scale: 0 });
      utils.set(sparks, { opacity: 0 });
      utils.set(hint, { opacity: 0, y: 8 });

      const drawable = createDrawable(root.querySelectorAll(".hg-path"), 0, 0);
      const intro = createTimeline({ defaults: { ease: "out(3)" } });

      intro
        .add(ring, { scale: [0.72, 1], opacity: [0, 0.9], duration: 900 }, 0)
        .add(ringB, { scale: [0.55, 1], opacity: [0, 0.55], duration: 1100 }, 80)
        .add(
          drawable,
          {
            draw: ["0 0", "0 1"],
            duration: 1400,
            delay: stagger(70),
            ease: "inOut(3)",
          },
          120
        )
        .add(
          nodes,
          {
            opacity: [0, 1],
            scale: [0.55, 1],
            duration: 620,
            delay: stagger(75, { from: "center" }),
            ease: "out(4)",
          },
          420
        )
        .add(
          dots,
          {
            opacity: [0, 0.45],
            scale: [0, 1],
            duration: 700,
            delay: stagger(28, { from: "center", grid: [7, 4] }),
            ease: "out(3)",
          },
          500
        )
        .add(sparks, { opacity: [0, 1], duration: 400, delay: stagger(60) }, 780)
        .add(hint, { opacity: [0, 1], y: [8, 0], duration: 500 }, 900);

      cleanups.push(() => intro.revert?.() || intro.pause?.());

      if (center && morphTarget) {
        const morphLoop = animate(center, {
          d: morphTo(morphTarget, 0.6),
          duration: 2800,
          ease: "inOut(2)",
          loop: true,
          alternate: true,
        });
        cleanups.push(() => morphLoop.revert?.() || morphLoop.pause?.());
      }

      const spinA = animate(ring, {
        rotate: 360,
        duration: 32000,
        ease: "linear",
        loop: true,
      });
      const spinB = animate(ringB, {
        rotate: -360,
        duration: 22000,
        ease: "linear",
        loop: true,
      });
      cleanups.push(() => {
        spinA.revert?.() || spinA.pause?.();
        spinB.revert?.() || spinB.pause?.();
      });

      if (pulse) {
        const p1 = animate(pulse, {
          scale: [1, 1.45],
          opacity: [0.35, 0],
          duration: 2200,
          ease: "out(2)",
          loop: true,
        });
        cleanups.push(() => p1.revert?.() || p1.pause?.());
      }
      if (pulse2) {
        const p2 = animate(pulse2, {
          scale: [1, 1.7],
          opacity: [0.22, 0],
          duration: 2800,
          delay: 700,
          ease: "out(2)",
          loop: true,
        });
        cleanups.push(() => p2.revert?.() || p2.pause?.());
      }

      const floatDots = animate(dots, {
        opacity: stagger([0.18, 0.55]),
        scale: stagger([0.7, 1.25]),
        duration: 2200,
        delay: stagger(90, { from: "center" }),
        ease: "inOut(2)",
        loop: true,
        alternate: true,
      });
      cleanups.push(() => floatDots.revert?.() || floatDots.pause?.());

      sparks.forEach((spark, i) => {
        const orbit = root.querySelector(`.hg-orbit-${(i % 3) + 1}`);
        if (!orbit) return;
        const motion = createMotionPath(orbit);
        const tw = animate(spark, {
          ...motion,
          duration: 5500 + i * 1400,
          ease: "linear",
          loop: true,
        });
        cleanups.push(() => tw.revert?.() || tw.pause?.());
      });

      if (hub) {
        try {
          const drag = createDraggable(hub, {
            container: root.querySelector(".hg__stage") || root,
            releaseEase: createSpring({ stiffness: 160, damping: 14 }),
            onRelease: () => {
              animate(hub, {
                x: 0,
                y: 0,
                duration: 700,
                ease: createSpring({ stiffness: 140, damping: 12 }),
              });
            },
          });
          cleanups.push(() => drag.revert?.());
        } catch {
          /* SVG hub pode não aceitar Draggable em alguns browsers */
        }
      }

      nodes.forEach((node) => {
        const hit = node.querySelector(".hg-node__hit");
        const glow = node.querySelector(".hg-node__glow");
        const label = node.querySelector(".hg-node__label");
        const core = node.querySelector(".hg-node__core");
        const id = node.dataset.id;
        let hoverTw;

        const enter = () => {
          hoverTw?.revert?.();
          hoverTw = createTimeline({ defaults: { ease: "out(3)" } })
            .add(node, { scale: 1.2, duration: 360 }, 0)
            .add(glow, { r: 36, opacity: 0.58, duration: 360 }, 0)
            .add(label, { y: -8, duration: 280 }, 0)
            .add(core, { rotate: 14, duration: 360 }, 0);

          animate(paths, { opacity: 0.28, duration: 280 });
          const links = root.querySelectorAll(`[data-link="${id}"]`);
          animate(links, { opacity: 1, strokeWidth: 2.6, duration: 280 });
          animate(dots, { opacity: 0.18, duration: 280 });
        };

        const leave = () => {
          hoverTw?.revert?.();
          hoverTw = createTimeline({ defaults: { ease: "out(2)" } })
            .add(node, { scale: 1, duration: 420 }, 0)
            .add(glow, { r: 22, opacity: 0.22, duration: 420 }, 0)
            .add(label, { y: 0, duration: 300 }, 0)
            .add(core, { rotate: 0, duration: 360 }, 0);

          animate(paths, { opacity: 0.72, strokeWidth: 1.6, duration: 300 });
          animate(dots, { opacity: 0.4, duration: 300 });
        };

        hit?.addEventListener("pointerenter", enter);
        hit?.addEventListener("pointerleave", leave);
        hit?.addEventListener("focus", enter);
        hit?.addEventListener("blur", leave);
        cleanups.push(() => {
          hit?.removeEventListener("pointerenter", enter);
          hit?.removeEventListener("pointerleave", leave);
          hit?.removeEventListener("focus", enter);
          hit?.removeEventListener("blur", leave);
          hoverTw?.revert?.();
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

  const stroke = `url(#${uid}-stroke)`;
  const fill = `url(#${uid}-fill)`;
  const soft = `url(#${uid}-soft)`;

  return (
    <div className="hg" ref={rootRef} aria-label="Ecossistema Koruvision animado com Anime.js">
      <div className="hg__stage">
        <svg className="hg__svg" viewBox="0 0 640 480" role="img">
          <defs>
            <linearGradient id={`${uid}-stroke`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c41e2a" />
              <stop offset="100%" stopColor="#c9a76a" />
            </linearGradient>
            <linearGradient id={`${uid}-fill`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e02332" />
              <stop offset="100%" stopColor="#8a1018" />
            </linearGradient>
            <filter id={`${uid}-soft`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path className="hg-orbit-1" d="M320,240 m-150,0 a150,110 0 1,1 300,0 a150,110 0 1,1 -300,0" fill="none" />
          <path className="hg-orbit-2" d="M320,240 m-110,0 a110,150 0 1,0 220,0 a110,150 0 1,0 -220,0" fill="none" />
          <path className="hg-orbit-3" d="M320,240 m-180,0 a180,90 0 1,1 360,0 a180,90 0 1,1 -360,0" fill="none" />

          {DOTS.map((d) => (
            <circle key={d.id} className="hg-dot" cx={d.x} cy={d.y} r={d.s} fill="#c9a76a" />
          ))}

          <circle
            className="hg-ring"
            cx="320"
            cy="240"
            r="172"
            fill="none"
            stroke={stroke}
            strokeWidth="1.1"
            strokeOpacity="0.4"
            strokeDasharray="5 11"
            style={{ transformOrigin: "320px 240px" }}
          />
          <circle
            className="hg-ring-b"
            cx="320"
            cy="240"
            r="128"
            fill="none"
            stroke={stroke}
            strokeWidth="0.9"
            strokeOpacity="0.28"
            strokeDasharray="2 8"
            style={{ transformOrigin: "320px 240px" }}
          />

          {NODES.map((n) => (
            <path
              key={`p-${n.id}`}
              className="hg-path"
              data-link={n.id}
              d={`M320 240 L${n.cx} ${n.cy}`}
              fill="none"
              stroke={stroke}
              strokeWidth="1.6"
              strokeOpacity="0.75"
              strokeLinecap="round"
            />
          ))}

          <g className="hg-hub" style={{ transformOrigin: "320px 240px" }}>
            <g transform="translate(320 240)">
              <circle className="hg-hub-pulse" r="48" fill="#c41e2a" opacity="0.28" />
              <circle className="hg-hub-pulse-2" r="48" fill="#c9a76a" opacity="0.18" />
              <circle r="42" fill={fill} filter={soft} />
              <path
                className="hg-center-shape"
                d="M0-28c18 8 28 20 28 34s-10 28-28 34c-18-6-28-20-28-34s10-26 28-34z"
                fill="#faf7f4"
                opacity="0.94"
              />
              <path
                className="hg-morph-target"
                d="M0-20c24 0 38 16 38 32s-14 32-38 32c-24 0-38-16-38-32s14-32 38-32z"
                fill="none"
                opacity="0"
              />
              <text
                textAnchor="middle"
                y="6"
                fill="#8a1018"
                fontSize="13"
                fontFamily="Outfit, sans-serif"
                fontWeight="600"
                style={{ pointerEvents: "none" }}
              >
                KV
              </text>
            </g>
          </g>

          {NODES.map((n) => (
            <g key={n.id} className="hg-node" data-id={n.id} style={{ transformOrigin: `${n.cx}px ${n.cy}px` }}>
              <g transform={`translate(${n.cx} ${n.cy})`}>
                <circle className="hg-node__glow" r="22" fill="#c9a76a" opacity="0.22" />
                <circle className="hg-node__core" r="18" fill="#fff" stroke={stroke} strokeWidth="2" />
                <circle r="5" fill="#c41e2a" />
                <text
                  className="hg-node__label"
                  textAnchor="middle"
                  y="36"
                  fill="#141414"
                  fontSize="12"
                  fontFamily="Outfit, sans-serif"
                  fontWeight="600"
                >
                  {n.label}
                </text>
                <circle className="hg-node__hit" r="30" fill="transparent" tabIndex="0" role="button" aria-label={n.label} />
              </g>
            </g>
          ))}

          <circle className="hg-spark" r="4.2" fill="#c9a76a" />
          <circle className="hg-spark" r="3.4" fill="#c41e2a" />
          <circle className="hg-spark" r="3.8" fill="#d4bc8a" />
        </svg>
      </div>
      <p className="hg__hint">Arraste o hub · hover nos nós · Anime.js</p>
    </div>
  );
}
