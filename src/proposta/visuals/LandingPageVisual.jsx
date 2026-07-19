import { MockShell } from "./MockShell.jsx";
import { useVisualMotion, track } from "./useVisualMotion.js";

export function LandingPageVisual() {
  const rootRef = useVisualMotion(({ animate, createTimeline, stagger, utils, root }) => {
    const cleanups = [];
    const blocks = root.querySelectorAll(".lpv-block");
    const cta = root.querySelector(".lpv-cta");
    const fields = root.querySelectorAll(".lpv-field");

    utils.set(blocks, { opacity: 0, y: 20 });
    track(
      cleanups,
      createTimeline({ defaults: { ease: "out(3)" } })
        .add(blocks, { opacity: 1, y: 0, duration: 550, delay: stagger(100) }, 0)
        .add(fields, { scaleX: [0, 1], duration: 400, delay: stagger(80), ease: "out(2)" }, 350)
    );

    track(cleanups, animate(cta, { scale: [1, 1.06, 1], duration: 1600, ease: "inOut(2)", loop: true }));

    const scroller = root.querySelector(".lpv-scroll");
    if (scroller) {
      track(
        cleanups,
        animate(scroller, { y: [0, -40, 0], duration: 5000, ease: "inOut(2)", loop: true })
      );
    }

    return () => cleanups.forEach((fn) => fn());
  });

  return (
    <div className="slide-visual" ref={rootRef} data-visual-root>
      <MockShell type="tablet" title="campanha.dgmodas">
        <div className="lpv">
          <div className="lpv-scroll">
            <div className="lpv-block lpv-hero" data-wire>
              <div className="lpv-hero-img" />
              <div className="lpv-hero-txt">
                <div className="lpv-line lpv-line--lg" />
                <div className="lpv-line" />
                <button type="button" className="lpv-cta">
                  Quero comprar
                </button>
              </div>
            </div>
            <div className="lpv-block lpv-form" data-wire>
              <div className="lpv-field" />
              <div className="lpv-field" />
              <div className="lpv-field lpv-field--btn" />
            </div>
            <div className="lpv-block lpv-secs" data-wire>
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </MockShell>
    </div>
  );
}
