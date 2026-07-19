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
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="16" cy="16" r="16" fill="#25D366" />
          <path
            fill="#fff"
            d="M22.9 19.6c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.4-2.3-1.4-1.1-.9-1.5-1.7-1.7-2-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.3.2-.4 0-.1 0-.3-.1-.4-.1-.1-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.1s1 2.4 1.1 2.6c.1.2 1.9 2.9 4.6 4 .6.3 1.2.4 1.6.5.7.2 1.3.2 1.8.1.5-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM16.1 5.4C10.6 5.4 6.1 9.9 6.1 15.4c0 2 .6 3.9 1.6 5.4L6 26l5.3-1.7c1.5.8 3.1 1.3 4.8 1.3 5.5 0 10-4.5 10-10s-4.5-10.2-10-10.2zm0 18.4c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1 1 .9-3.1-.2-.3c-.9-1.4-1.4-3-1.4-4.6 0-4.6 3.8-8.4 8.5-8.4s8.5 3.8 8.5 8.4-3.8 8.4-8.5 8.4z"
          />
        </svg>
      </a>
    </>
  );
}
