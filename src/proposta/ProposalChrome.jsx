import { useEffect, useRef, useState } from "react";
import { SECTIONS } from "./data/proposalContent.js";
import { assetUrl } from "../lib/utils.js";

export function ProposalChrome({ activeId, onNavigate }) {
  const [open, setOpen] = useState(false);
  const progressRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const p = max > 0 ? el.scrollTop / max : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    onNavigate?.(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="prop-progress" aria-hidden="true">
        <div className="prop-progress__bar" ref={progressRef} />
      </div>
      <header className="prop-chrome">
        <div className="prop-chrome__inner">
          <a className="prop-chrome__brand" href="#capa" onClick={(e) => { e.preventDefault(); go("capa"); }}>
            <img
              className="prop-chrome__logo"
              src={assetUrl("assets/logo-header-sm.webp")}
              alt="D&G Modas"
              width="44"
              height="44"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = assetUrl("assets/logo-dg-modas-sm.webp");
              }}
            />
            <span className="prop-chrome__names">
              <strong>D&amp;G Modas</strong>
              <em>proposta · Koruvision</em>
            </span>
          </a>

          <nav className="prop-chrome__nav" aria-label="Seções da proposta">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`prop-chrome__dot${activeId === s.id ? " is-active" : ""}`}
                title={s.label}
                aria-label={s.label}
                aria-current={activeId === s.id ? "true" : undefined}
                onClick={() => go(s.id)}
              />
            ))}
          </nav>

          <button
            type="button"
            className="prop-chrome__menu-btn"
            aria-expanded={open}
            aria-label="Abrir seções"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>

        {open && (
          <div className="prop-chrome__drawer">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={activeId === s.id ? "is-active" : ""}
                onClick={() => go(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
