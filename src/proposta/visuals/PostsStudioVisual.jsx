import { MockShell } from "./MockShell.jsx";
import { useVisualMotion, track } from "./useVisualMotion.js";

export function PostsStudioVisual() {
  const rootRef = useVisualMotion(({ animate, createTimeline, stagger, scrambleText, utils, root }) => {
    const cleanups = [];
    const days = root.querySelectorAll(".psv-day");
    const ai = root.querySelector(".psv-ai-text");
    const cards = root.querySelectorAll(".psv-post");

    utils.set(days, { opacity: 0.25 });
    utils.set(cards, { opacity: 0, y: 10 });

    track(
      cleanups,
      createTimeline({ defaults: { ease: "out(3)" } })
        .add(days, { opacity: 1, duration: 400, delay: stagger(25) }, 0)
        .add(cards, { opacity: 1, y: 0, duration: 480, delay: stagger(90) }, 200)
    );

    if (ai) {
      try {
        track(
          cleanups,
          animate(ai, {
            text: scrambleText({
              text: "Nova coleção outono · tom vinho e ouro ✨",
              chars: "░▒▓·+",
            }),
            duration: 2200,
            ease: "out(2)",
            loop: true,
            loopDelay: 1200,
          })
        );
      } catch {
        track(cleanups, animate(ai, { opacity: [0.5, 1, 0.5], duration: 2000, loop: true }));
      }
    }

    track(
      cleanups,
      animate(cards, {
        y: [0, -4, 0],
        duration: 2200,
        delay: stagger(180),
        loop: true,
      })
    );

    return () => cleanups.forEach((fn) => fn());
  });

  return (
    <div className="slide-visual" ref={rootRef} data-visual-root>
      <MockShell type="dashboard" title="Koruvision Posts">
        <div className="psv">
          <aside className="psv-side">
            <div className="psv-ai">
              <strong>IA</strong>
              <p className="psv-ai-text">Gerando legenda…</p>
            </div>
          </aside>
          <div className="psv-main">
            <div className="psv-cal">
              {Array.from({ length: 28 }, (_, i) => (
                <span key={i} className={`psv-day${[3, 8, 12, 17, 22].includes(i) ? " is-on" : ""}`} data-wire />
              ))}
            </div>
            <div className="psv-queue">
              {["Story", "Feed", "Reels"].map((t) => (
                <div key={t} className="psv-post" data-wire>
                  <b>{t}</b>
                  <i />
                </div>
              ))}
            </div>
          </div>
        </div>
      </MockShell>
    </div>
  );
}
