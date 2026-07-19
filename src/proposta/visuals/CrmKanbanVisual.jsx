import { MockShell } from "./MockShell.jsx";
import { useVisualMotion, track } from "./useVisualMotion.js";

export function CrmKanbanVisual() {
  const rootRef = useVisualMotion(({ animate, createTimeline, stagger, utils, gsap, root }) => {
    const cleanups = [];
    const cols = root.querySelectorAll(".ckv-col");
    const cards = root.querySelectorAll(".ckv-card");
    const mover = root.querySelector(".ckv-mover");

    utils.set(cols, { opacity: 0, y: 14 });
    utils.set(cards, { opacity: 0, scale: 0.9 });

    track(
      cleanups,
      createTimeline({ defaults: { ease: "out(3)" } })
        .add(cols, { opacity: 1, y: 0, duration: 500, delay: stagger(80) }, 0)
        .add(cards, { opacity: 1, scale: 1, duration: 420, delay: stagger(50) }, 180)
    );

    if (mover) {
      track(
        cleanups,
        gsap.to(mover, {
          keyframes: [
            { x: 0, y: 0, duration: 0.8 },
            { x: 118, duration: 1.1, ease: "power2.inOut" },
            { x: 236, duration: 1.1, ease: "power2.inOut" },
            { x: 0, duration: 1.2, ease: "power2.inOut" },
          ],
          repeat: -1,
          repeatDelay: 0.6,
        })
      );
    }

    track(
      cleanups,
      animate(cards, {
        y: stagger([0, -3]),
        duration: 2000,
        delay: stagger(100),
        loop: true,
        alternate: true,
      })
    );

    return () => cleanups.forEach((fn) => fn());
  });

  const columns = [
    { t: "Novo", n: 3 },
    { t: "Qualificado", n: 2 },
    { t: "Proposta", n: 2 },
    { t: "Fechado", n: 1 },
  ];

  return (
    <div className="slide-visual" ref={rootRef} data-visual-root>
      <MockShell type="dashboard" title="CRM Koruvision">
        <div className="ckv">
          {columns.map((c) => (
            <div key={c.t} className="ckv-col" data-wire>
              <header>
                {c.t} <em>{c.n}</em>
              </header>
              {Array.from({ length: c.n }, (_, i) => (
                <div key={i} className="ckv-card">
                  <span />
                  <span />
                </div>
              ))}
            </div>
          ))}
          <div className="ckv-mover" aria-hidden="true">
            Lead
          </div>
        </div>
      </MockShell>
    </div>
  );
}
