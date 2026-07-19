import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header.jsx";
import { Footer } from "./Footer.jsx";
import { useConfig } from "../hooks/useConfig.js";
import { usePageAnimations } from "../hooks/usePageAnimations.js";
import { useUi } from "../hooks/useUi.jsx";

export function Shell({ children }) {
  const location = useLocation();
  const cfg = useConfig();
  const ui = useUi();
  const isHome = location.pathname === "/";
  const wa = cfg ? `https://wa.me/${cfg.whatsapp}` : "#";
  const [contentKey, setContentKey] = useState(0);
  const hideFloat = ui.cartOpen || ui.searchOpen;

  usePageAnimations(contentKey);

  useEffect(() => {
    document.body.classList.toggle("page-inner", !isHome);
  }, [isHome]);

  useEffect(() => {
    let frames = 0;
    const id = window.setInterval(() => {
      frames += 1;
      const n = document.querySelectorAll(
        "main .product-card, main .stat, main .feature-card, main .quote-card"
      ).length;
      setContentKey(n);
      if (frames > 12) window.clearInterval(id);
    }, 250);
    return () => window.clearInterval(id);
  }, [location.pathname, location.search]);

  return (
    <>
      <Header />
      <main key={location.pathname}>{children}</main>
      <Footer />
      <a
        className={`whatsapp-float ${hideFloat ? "is-hidden" : ""}`}
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        hidden={hideFloat}
      >
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M20.5 3.5A11.8 11.8 0 0 0 12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6A11.9 11.9 0 0 0 12 24c6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.5-8.5zM12 22a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.9 9.9 0 1 1 12 22z"
          />
        </svg>
      </a>
    </>
  );
}
