import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const COOKIE_KEY = "dg_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(COOKIE_KEY);
      if (!saved) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const save = (value) => {
    try {
      localStorage.setItem(COOKIE_KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Aviso de cookies" aria-live="polite">
      <div className="cookie-banner__inner">
        <div className="cookie-banner__text">
          <strong>Cookies e privacidade</strong>
          <p>
            Usamos cookies essenciais para o funcionamento da loja (carrinho, favoritos e preferências). Ao continuar,
            você concorda com nossa{" "}
            <Link to="/privacidade">Política de Privacidade</Link> e os{" "}
            <Link to="/termos">Termos de Uso</Link>.
          </p>
        </div>
        <div className="cookie-banner__actions">
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => save("essential")}>
            Apenas essenciais
          </button>
          <button type="button" className="btn btn--wine btn--sm" onClick={() => save("accepted")}>
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
