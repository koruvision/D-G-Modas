import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsapSetup.js";

/**
 * Mascote DG Modas em SVG — no chão, pula e pisca em intervalos.
 */
export function BagMascot() {
  const rootRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    if (!root || !svg) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = (sel) => svg.querySelector(sel);
    const qa = (sel) => [...svg.querySelectorAll(sel)];

    const figure = q(".bm-figure");
    const shadow = q(".bm-shadow");
    const armL = q(".bm-arm-l");
    const armR = q(".bm-arm-r");
    const legL = q(".bm-leg-l");
    const legR = q(".bm-leg-r");
    const lids = qa(".bm-lid");
    const sparkles = q(".bm-sparkles");

    gsap.set(figure, { transformOrigin: "50% 92%", y: 0 });
    gsap.set(armL, { transformOrigin: "88% 18%" });
    gsap.set(armR, { transformOrigin: "12% 18%" });
    gsap.set(legL, { transformOrigin: "50% 8%" });
    gsap.set(legR, { transformOrigin: "50% 8%" });
    gsap.set(lids, { scaleY: 0, transformOrigin: "50% 50%" });
    gsap.set(sparkles, { autoAlpha: 0.2 });
    gsap.set(shadow, { transformOrigin: "50% 50%", scaleX: 1, opacity: 0.14 });

    const intro = gsap.from(root, {
      autoAlpha: 0,
      y: 10,
      duration: 0.8,
      ease: "power2.out",
    });

    if (reduce) {
      return () => intro.kill();
    }

    // Pulos ocasionais no chão (sem flutuação)
    const jump = gsap.timeline({
      repeat: -1,
      repeatDelay: 3.2,
      defaults: { ease: "power2.inOut" },
    });

    jump
      .to(figure, { y: 3, scaleY: 0.94, scaleX: 1.05, duration: 0.28, ease: "power2.in" }, 0)
      .to(shadow, { scaleX: 1.08, opacity: 0.2, duration: 0.28 }, 0)
      .to(armL, { rotation: 12, duration: 0.28 }, 0)
      .to(armR, { rotation: -10, duration: 0.28 }, 0)
      .to(figure, { y: -32, scaleY: 1.04, scaleX: 0.96, duration: 0.42, ease: "power2.out" }, 0.28)
      .to(shadow, { scaleX: 0.55, opacity: 0.06, duration: 0.42 }, 0.28)
      .to(legL, { rotation: -14, duration: 0.42 }, 0.28)
      .to(legR, { rotation: 14, duration: 0.42 }, 0.28)
      .to(armL, { rotation: -30, duration: 0.42 }, 0.28)
      .to(armR, { rotation: 28, duration: 0.42 }, 0.28)
      .to(sparkles, { autoAlpha: 0.75, duration: 0.3 }, 0.35)
      .to(figure, { y: 0, scaleY: 1, scaleX: 1, duration: 0.48, ease: "bounce.out" }, 0.7)
      .to(shadow, { scaleX: 1, opacity: 0.14, duration: 0.48 }, 0.7)
      .to(legL, { rotation: 0, duration: 0.4 }, 0.7)
      .to(legR, { rotation: 0, duration: 0.4 }, 0.7)
      .to(armL, { rotation: 0, duration: 0.45 }, 0.7)
      .to(armR, { rotation: 0, duration: 0.45 }, 0.7)
      .to(sparkles, { autoAlpha: 0.2, duration: 0.5 }, 0.9);

    // Piscar em intervalos (mais lenta)
    const blink = gsap.timeline({ repeat: -1, repeatDelay: 2.8 });
    blink
      .to(lids, { scaleY: 1, duration: 0.14, ease: "power1.in", stagger: 0.02 })
      .to(lids, { scaleY: 0, duration: 0.18, ease: "power1.out", stagger: 0.02 })
      .to({}, { duration: 2.0 })
      .to(lids, { scaleY: 1, duration: 0.12 })
      .to(lids, { scaleY: 0, duration: 0.16 })
      .to(lids, { scaleY: 1, duration: 0.12 }, "+=0.14")
      .to(lids, { scaleY: 0, duration: 0.18 })
      .to({}, { duration: 3.8 });

    const twinkle = gsap.to(qa(".bm-spark"), {
      scale: 1.25,
      opacity: 0.35,
      duration: 1.6,
      stagger: { each: 0.4, repeat: -1, yoyo: true },
      ease: "sine.inOut",
      transformOrigin: "50% 50%",
    });

    return () => {
      intro.kill();
      jump.kill();
      blink.kill();
      twinkle.kill();
    };
  }, []);

  return (
    <div ref={rootRef} className="bag-mascot bag-mascot--svg" aria-hidden="true">
      <div className="bag-mascot__media bag-mascot__media--svg">
        <svg
          ref={svgRef}
          className="bag-mascot__svg"
          viewBox="0 0 200 220"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
        >
          <defs>
            <linearGradient id="bmBag" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e02332" />
              <stop offset="45%" stopColor="#c41e2a" />
              <stop offset="100%" stopColor="#8a1018" />
            </linearGradient>
            <linearGradient id="bmGold" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d4bc8a" />
              <stop offset="50%" stopColor="#c9a76a" />
              <stop offset="100%" stopColor="#a8894f" />
            </linearGradient>
            <linearGradient id="bmGlove" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f0ebe6" />
            </linearGradient>
            <filter id="bmSoft" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="2.2" floodColor="#8a1018" floodOpacity="0.22" />
            </filter>
            <clipPath id="bmEyeL">
              <ellipse cx="82" cy="88" rx="11" ry="12" />
            </clipPath>
            <clipPath id="bmEyeR">
              <ellipse cx="118" cy="88" rx="11" ry="12" />
            </clipPath>
          </defs>

          {/* chão / sombra */}
          <ellipse className="bm-shadow" cx="100" cy="205" rx="48" ry="8" fill="#8a1018" opacity="0.14" />

          <g className="bm-figure">
            <g className="bm-leg-l">
              <path d="M78 168 L74 188" stroke="url(#bmGold)" strokeWidth="5" strokeLinecap="round" fill="none" />
              <g transform="translate(62 186)">
                <rect width="26" height="12" rx="4" fill="#8a1018" />
                <rect y="8" width="26" height="5" rx="2" fill="#faf7f4" />
                <path d="M8 2 L13 0 L18 2" fill="url(#bmGold)" />
              </g>
            </g>
            <g className="bm-leg-r">
              <path d="M122 168 L126 188" stroke="url(#bmGold)" strokeWidth="5" strokeLinecap="round" fill="none" />
              <g transform="translate(112 186)">
                <rect width="26" height="12" rx="4" fill="#8a1018" />
                <rect y="8" width="26" height="5" rx="2" fill="#faf7f4" />
                <path d="M8 2 L13 0 L18 2" fill="url(#bmGold)" />
              </g>
            </g>

            <g className="bm-handles">
              <path
                d="M72 58 C72 28, 90 22, 100 22 C110 22, 128 28, 128 58"
                fill="none"
                stroke="url(#bmGold)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M78 58 C78 36, 92 30, 100 30 C108 30, 122 36, 122 58"
                fill="none"
                stroke="#a8894f"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.55"
              />
            </g>

            <g className="bm-arm-l">
              <path d="M62 95 C48 108, 42 125, 40 138" stroke="url(#bmGold)" strokeWidth="5" strokeLinecap="round" fill="none" />
              <g transform="translate(28 132)">
                <ellipse cx="10" cy="10" rx="11" ry="10" fill="url(#bmGlove)" filter="url(#bmSoft)" />
                <path d="M16 4 C22 -2, 28 4, 24 10 C30 8, 30 16, 24 16 L12 16 Z" fill="url(#bmGlove)" />
                <circle cx="22" cy="3" r="3.2" fill="url(#bmGlove)" />
              </g>
            </g>

            <g className="bm-body" filter="url(#bmSoft)">
              <path
                d="M58 62 H142 C148 62 152 66 152 72 V160 C152 168 146 174 138 174 H62 C54 174 48 168 48 160 V72 C48 66 52 62 58 62 Z"
                fill="url(#bmBag)"
              />
              <path d="M58 62 H142 L138 70 H62 Z" fill="#8a1018" opacity="0.35" />
              <path d="M54 78 H146" stroke="#faf7f4" strokeWidth="1.2" opacity="0.18" />

              <g transform="translate(100 142)">
                <path d="M0 -14 L3.2 -8 L9.5 -8 L4.8 -3.2 L6.5 3.2 L0 -0.8 L-6.5 3.2 L-4.8 -3.2 L-9.5 -8 L-3.2 -8 Z" fill="url(#bmGold)" />
                <text
                  textAnchor="middle"
                  y="12"
                  fill="url(#bmGold)"
                  fontFamily="Georgia, 'Times New Roman', serif"
                  fontSize="10"
                  fontWeight="700"
                  letterSpacing="1.5"
                >
                  D&amp;G
                </text>
                <text
                  textAnchor="middle"
                  y="21"
                  fill="#d4bc8a"
                  fontFamily="Outfit, system-ui, sans-serif"
                  fontSize="5"
                  letterSpacing="2.5"
                >
                  MODAS
                </text>
              </g>
            </g>

            <g className="bm-face">
              <ellipse cx="82" cy="88" rx="11" ry="12" fill="#fff" />
              <ellipse cx="118" cy="88" rx="11" ry="12" fill="#fff" />
              <g clipPath="url(#bmEyeL)">
                <circle className="bm-pupil-l" cx="84" cy="90" r="4.2" fill="#1a1a1a" />
                <circle cx="86" cy="88" r="1.3" fill="#fff" />
                <rect className="bm-lid" x="70" y="76" width="24" height="24" fill="#c41e2a" />
              </g>
              <g clipPath="url(#bmEyeR)">
                <circle className="bm-pupil-r" cx="120" cy="90" r="4.2" fill="#1a1a1a" />
                <circle cx="122" cy="88" r="1.3" fill="#fff" />
                <rect className="bm-lid" x="106" y="76" width="24" height="24" fill="#c41e2a" />
              </g>
              <path
                d="M88 108 C96 118, 104 118, 112 108"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path d="M94 112 C98 118, 102 118, 106 112" fill="#e02332" opacity="0.85" />
            </g>

            <g className="bm-arm-r">
              <path d="M138 95 C152 105, 158 118, 156 132" stroke="url(#bmGold)" strokeWidth="5" strokeLinecap="round" fill="none" />
              <g transform="translate(146 128)">
                <ellipse cx="10" cy="10" rx="11" ry="10" fill="url(#bmGlove)" filter="url(#bmSoft)" />
                <path d="M4 8 L-2 14 L4 16 L8 12 Z" fill="url(#bmGlove)" />
              </g>
            </g>

            <g className="bm-sparkles">
              <path className="bm-spark" d="M36 70 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z" fill="url(#bmGold)" />
              <path className="bm-spark" d="M164 78 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6 z" fill="url(#bmGold)" />
              <path className="bm-spark" d="M48 48 l1.4 3.5 3.5 1.4 -3.5 1.4 -1.4 3.5 -1.4 -3.5 -3.5 -1.4 3.5 -1.4 z" fill="#d4bc8a" />
              <path className="bm-spark" d="M155 52 l1.4 3.5 3.5 1.4 -3.5 1.4 -1.4 3.5 -1.4 -3.5 -3.5 -1.4 3.5 -1.4 z" fill="#d4bc8a" />
            </g>
          </g>
        </svg>
      </div>
      <p className="bag-mascot__caption">Seu pedido está quase pronto!</p>
    </div>
  );
}
