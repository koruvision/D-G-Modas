import { MockShell } from "./MockShell.jsx";
import { useVisualMotion, track } from "./useVisualMotion.js";

export function CatalogPhoneVisual() {
  const rootRef = useVisualMotion(({ animate, createTimeline, stagger, utils, root }) => {
    const cleanups = [];
    const tiles = root.querySelectorAll(".cpv-tile");
    const cards = root.querySelectorAll(".cpv-card");
    const qr = root.querySelector(".cpv-qr");

    utils.set([...tiles, ...cards], { opacity: 0, y: 12 });
    track(
      cleanups,
      createTimeline()
        .add(tiles, { opacity: 1, y: 0, duration: 480, delay: stagger(60), ease: "out(3)" }, 0)
        .add(cards, { opacity: 1, y: 0, duration: 500, delay: stagger(80), ease: "out(3)" }, 200)
        .add(qr, { scale: [0.6, 1], opacity: [0, 1], duration: 450, ease: "out(4)" }, 400)
    );

    track(
      cleanups,
      animate(cards, {
        x: [-8, 8, -8],
        duration: 3600,
        delay: stagger(200),
        ease: "inOut(2)",
        loop: true,
      })
    );
    track(cleanups, animate(qr, { scale: [1, 1.08, 1], opacity: [1, 0.75, 1], duration: 1800, loop: true }));

    return () => cleanups.forEach((fn) => fn());
  });

  return (
    <div className="slide-visual slide-visual--phone" ref={rootRef} data-visual-root>
      <MockShell type="phone" title="Catálogo">
        <div className="cpv">
          <div className="cpv-head">
            <span />
            <strong>Catálogo</strong>
            <i className="cpv-qr" />
          </div>
          <div className="cpv-cats">
            {["Fem", "Masc", "Kids", "Promo"].map((t) => (
              <span key={t} className="cpv-tile" data-wire>
                {t}
              </span>
            ))}
          </div>
          <div className="cpv-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className="cpv-card" data-wire>
                <div className="cpv-img" />
                <div>
                  <div className="cpv-line" />
                  <div className="cpv-line cpv-line--s" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </MockShell>
    </div>
  );
}
