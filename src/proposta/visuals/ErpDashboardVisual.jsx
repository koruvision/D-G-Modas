import { MockShell } from "./MockShell.jsx";
import { useVisualMotion, track } from "./useVisualMotion.js";

export function ErpDashboardVisual() {
  const rootRef = useVisualMotion(({ animate, createTimeline, stagger, utils, root }) => {
    const cleanups = [];
    const rows = root.querySelectorAll(".erv-row");
    const sync = root.querySelector(".erv-sync");
    const pills = root.querySelectorAll(".erv-pill");

    utils.set(rows, { opacity: 0, x: -12 });
    track(
      cleanups,
      createTimeline()
        .add(root.querySelector(".erv-head"), { opacity: [0, 1], duration: 400 }, 0)
        .add(rows, { opacity: 1, x: 0, duration: 450, delay: stagger(70), ease: "out(3)" }, 100)
        .add(pills, { scale: [0.8, 1], opacity: [0, 1], duration: 400, delay: stagger(80) }, 300)
    );

    track(cleanups, animate(sync, { rotate: 360, duration: 2400, ease: "linear", loop: true }));
    track(
      cleanups,
      animate(rows, {
        backgroundColor: ["rgba(201,167,106,0)", "rgba(201,167,106,0.18)", "rgba(201,167,106,0)"],
        duration: 2800,
        delay: stagger(400),
        loop: true,
      })
    );

    return () => cleanups.forEach((fn) => fn());
  });

  const rows = [
    ["NF-1042", "Vinho Oversized", "12", "OK"],
    ["NF-1043", "Calça Imperial", "4", "Baixo"],
    ["NF-1044", "Bolsa Gold", "28", "OK"],
    ["NF-1045", "Vestido Cream", "9", "Sync"],
  ];

  return (
    <div className="slide-visual" ref={rootRef} data-visual-root>
      <MockShell type="laptop" title="Bling × Loja">
        <div className="erv">
          <div className="erv-head">
            <strong>Estoque & fiscal</strong>
            <span className="erv-sync" />
            <span className="erv-pill">Loja sync</span>
            <span className="erv-pill erv-pill--wine">NF-e</span>
          </div>
          <div className="erv-table">
            <div className="erv-row erv-row--h">
              <span>Doc</span>
              <span>Produto</span>
              <span>Qtd</span>
              <span>Status</span>
            </div>
            {rows.map((r) => (
              <div key={r[0]} className="erv-row" data-wire>
                {r.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </MockShell>
    </div>
  );
}
