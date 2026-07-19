import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Shell } from "./layout/Shell.jsx";
import { ToastHost } from "./components/ToastHost.jsx";
import { CartDrawer } from "./components/CartDrawer.jsx";
import { SearchModal } from "./components/SearchModal.jsx";
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

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
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
            </Routes>
          </Suspense>
        </Shell>
        <CartDrawer />
        <SearchModal />
        <ToastHost />
      </CartProvider>
    </UiProvider>
  );
}
