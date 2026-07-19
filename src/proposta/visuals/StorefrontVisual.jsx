import { MockShell } from "./MockShell.jsx";
import { useVisualMotion, track } from "./useVisualMotion.js";

export function StorefrontVisual() {
  const rootRef = useVisualMotion(({ animate, createTimeline, stagger, utils, gsap, root }) => {
    const cleanups = [];
    const shell = root.querySelector("[data-mock-shell]");
    const cards = root.querySelectorAll(".sfv-card");
    const cart = root.querySelector(".sfv-cart");
    const bar = root.querySelector(".sfv-progress");
    const cursor = root.querySelector(".sfv-cursor");

    utils.set(cards, { opacity: 0, y: 16 });
    track(
      cleanups,
      createTimeline({ defaults: { ease: "out(3)" } })
        .add(root.querySelectorAll(".sfv-chrome-bar"), { opacity: [0, 1], duration: 400 }, 0)
        .add(cards, { opacity: 1, y: 0, duration: 520, delay: stagger(70) }, 150)
        .add(cart, { scale: [0, 1], duration: 400, ease: "out(4)" }, 500)
    );

    track(
      cleanups,
      animate(cards, {
        y: stagger([0, -5]),
        duration: 2400,
        delay: stagger(120),
        ease: "inOut(2)",
        loop: true,
        alternate: true,
      })
    );

    if (bar) {
      track(cleanups, animate(bar, { width: ["18%", "72%", "40%"], duration: 4000, ease: "inOut(2)", loop: true }));
    }

    if (cursor) {
      track(
        cleanups,
        animate(cursor, {
          x: [20, 160, 90, 20],
          y: [40, 80, 140, 40],
          duration: 5000,
          ease: "inOut(2)",
          loop: true,
        })
      );
    }

    if (shell) {
      const enter = () => gsap.to(shell, { rotateY: 4, rotateX: -2, duration: 0.4, ease: "power2.out" });
      const leave = () => gsap.to(shell, { rotateY: 0, rotateX: 0, duration: 0.5, ease: "power3.out" });
      shell.addEventListener("pointerenter", enter);
      shell.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        shell.removeEventListener("pointerenter", enter);
        shell.removeEventListener("pointerleave", leave);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  });

  return (
    <div className="slide-visual" ref={rootRef} data-visual-root>
      <MockShell type="laptop" title="loja.dgmodas">
        <div className="sfv">
          <div className="sfv-chrome-bar">
            <span className="sfv-logo" />
            <span className="sfv-nav" />
            <span className="sfv-nav" />
            <span className="sfv-cart">2</span>
          </div>
          <div className="sfv-hero-wire" />
          <div className="sfv-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="sfv-card" data-wire>
                <div className="sfv-thumb" />
                <div className="sfv-line" />
                <div className="sfv-line sfv-line--short" />
                <div className="sfv-price" />
              </div>
            ))}
          </div>
          <div className="sfv-checkout">
            <span>Checkout</span>
            <div className="sfv-progress-wrap">
              <div className="sfv-progress" />
            </div>
          </div>
          <div className="sfv-cursor" aria-hidden="true" />
        </div>
      </MockShell>
    </div>
  );
}
