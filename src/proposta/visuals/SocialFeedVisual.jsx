import { useVisualMotion, track } from "./useVisualMotion.js";

export function SocialFeedVisual() {
  const rootRef = useVisualMotion(({ animate, createTimeline, stagger, utils, root }) => {
    const cleanups = [];
    const cells = root.querySelectorAll(".sov-cell");
    const rings = root.querySelectorAll(".sov-ring");
    const likes = root.querySelectorAll(".sov-like");

    utils.set(cells, { opacity: 0, scale: 0.85 });
    track(
      cleanups,
      createTimeline()
        .add(rings, { opacity: [0, 1], scale: [0.7, 1], duration: 500, delay: stagger(70), ease: "out(3)" }, 0)
        .add(cells, { opacity: 1, scale: 1, duration: 550, delay: stagger(45, { grid: [3, 3], from: "center" }), ease: "out(3)" }, 120)
    );

    track(
      cleanups,
      animate(rings, {
        rotate: 360,
        duration: 8000,
        delay: stagger(400),
        ease: "linear",
        loop: true,
      })
    );

    likes.forEach((el, i) => {
      let n = 120 + i * 37;
      const id = setInterval(() => {
        n += Math.floor(Math.random() * 3);
        el.textContent = String(n);
      }, 900 + i * 200);
      cleanups.push(() => clearInterval(id));
      track(cleanups, animate(el, { scale: [1, 1.15, 1], duration: 900, delay: i * 150, loop: true }));
    });

    return () => cleanups.forEach((fn) => fn());
  });

  return (
    <div className="slide-visual sov" ref={rootRef} data-visual-root>
      <div className="sov-stories">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="sov-ring" data-wire />
        ))}
      </div>
      <div className="sov-grid">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="sov-cell" data-wire>
            <span className="sov-like">♥ {120 + i * 11}</span>
          </div>
        ))}
      </div>
      <p className="slide-visual__cap">Feed + stories em motion</p>
    </div>
  );
}
