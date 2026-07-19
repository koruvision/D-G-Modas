import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Shell } from "./layout/Shell.jsx";
import { ToastHost } from "./components/ToastHost.jsx";
import { CartDrawer } from "./components/CartDrawer.jsx";
import { SearchModal } from "./components/SearchModal.jsx";
import { CookieConsent } from "./components/CookieConsent.jsx";
import { CartProvider } from "./hooks/useCart.jsx";
import { UiProvider } from "./hooks/useUi.jsx";

const HomePage = lazy(() =>
  import("./pages/HomePage.jsx").then((m) => ({ default: m.HomePage }))
);
const CatalogPage = lazy(() =>
  import("./pages/CatalogPage.jsx").then((m) => ({ default: m.CatalogPage }))
);
const ProductPage = lazy(() =>
  import("./pages/ProductPage.jsx").then((m) => ({ default: m.ProductPage }))
);
const CheckoutPage = lazy(() =>
  import("./pages/CheckoutPage.jsx").then((m) => ({ default: m.CheckoutPage }))
);
const FavoritesPage = lazy(() =>
  import("./pages/FavoritesPage.jsx").then((m) => ({ default: m.FavoritesPage }))
);
const ComparePage = lazy(() =>
  import("./pages/ComparePage.jsx").then((m) => ({ default: m.ComparePage }))
);
const PrivacyPage = lazy(() =>
  import("./pages/PrivacyPage.jsx").then((m) => ({ default: m.PrivacyPage }))
);
const TermsPage = lazy(() =>
  import("./pages/TermsPage.jsx").then((m) => ({ default: m.TermsPage }))
);

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace(/^#/, "");
      const el = document.getElementById(id);
      if (el) {
        window.requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
        return;
      }
      const t = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
      return () => window.clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function PageFallback() {
  return <div className="page-fallback" aria-hidden="true" />;
}

export default function App() {
  return (
    <UiProvider>
      <CartProvider>
        <ScrollToTop />
        <Shell>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalogo" element={<CatalogPage />} />
              <Route path="/produto/:slug" element={<ProductPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/favoritos" element={<FavoritesPage />} />
              <Route path="/comparar" element={<ComparePage />} />
              <Route path="/privacidade" element={<PrivacyPage />} />
              <Route path="/termos" element={<TermsPage />} />
            </Routes>
          </Suspense>
        </Shell>
        <CartDrawer />
        <SearchModal />
        <CookieConsent />
        <ToastHost />
      </CartProvider>
    </UiProvider>
  );
}
