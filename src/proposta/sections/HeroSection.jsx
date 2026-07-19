import { useEffect, useRef } from "react";
import { HERO } from "../data/proposalContent.js";
import { BrandLogos } from "../components/ui.jsx";
import { HeroGraphic } from "../components/HeroGraphic.jsx";
import { AmbientField } from "../components/AmbientField.jsx";
import { MockShell } from "../visuals/MockShell.jsx";

export function HeroSection({ onExplore }) {
  const titleRef = useRef(null);
  const eyebrowRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let cancelled = false;
    const cleanups = [];

    (async () => {
      const { animate, createTimeline, stagger, splitText, scrambleText } = await import("animejs");
      if (cancelled) return;

      if (eyebrowRef.current) {
        try {
          const scramble = animate(eyebrowRef.current, {
            text: scrambleText({ text: HERO.eyebrow, chars: "░▒▓█·+×" }),
            duration: 1400,
            ease: "out(3)",
          });
          cleanups.push(() => scramble.revert?.() || scramble.pause?.());
        } catch {
          /* scramble opcional */
        }
      }

      if (titleRef.current) {
        try {
          const split = splitText(titleRef.current, { chars: true });
          const tl = createTimeline({ defaults: { ease: "out(4)" } }).add(split.chars, {
            y: ["0.6em", "0em"],
            opacity: [0, 1],
            rotate: [8, 0],
            duration: 720,
            delay: stagger(22),
          });
          cleanups.push(() => {
            tl.revert?.() || tl.pause?.();
            split.revert?.();
          });
        } catch {
          /* split opcional */
        }
      }
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

  return (
    <section className="prop-section prop-hero" id="capa">
      <div className="prop-hero__glow" aria-hidden="true" />
      <div className="prop-hero__ambient" aria-hidden="true">
        <AmbientField count={36} />
      </div>
      <div className="prop-hero__content">
        <div data-hero-el>
          <BrandLogos size="lg" />
        </div>
        <p className="prop-eyebrow" data-hero-el ref={eyebrowRef}>
          {HERO.eyebrow}
        </p>
        <p className="prop-hero__pair" data-hero-el>
          <strong>{HERO.brand}</strong>
          <span>×</span>
          <em className="script">{HERO.partner}</em>
        </p>
        <h1 data-hero-el ref={titleRef}>
          {HERO.title}
        </h1>
        <p className="prop-lead" data-hero-el>
          {HERO.subtitle}
        </p>
        <div className="prop-hero__actions" data-hero-el>
          <button type="button" className="prop-btn prop-btn--wine" onClick={onExplore}>
            {HERO.cta}
          </button>
        </div>
      </div>
      <div className="prop-hero__visual prop-hero__visual--graphic" data-hero-el>
        <div className="prop-hero__mock">
          <MockShell type="dashboard" title="ecossistema.koruvision">
            <HeroGraphic />
          </MockShell>
        </div>
      </div>
    </section>
  );
}
