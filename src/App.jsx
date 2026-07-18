import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Shell } from "./layout/Shell.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { CatalogPage } from "./pages/CatalogPage.jsx";
import { ProductPage } from "./pages/ProductPage.jsx";
import { CheckoutPage } from "./pages/CheckoutPage.jsx";
import { FavoritesPage } from "./pages/FavoritesPage.jsx";
import { ComparePage } from "./pages/ComparePage.jsx";
import { ToastHost } from "./components/ToastHost.jsx";
import { CartDrawer } from "./components/CartDrawer.jsx";
import { SearchModal } from "./components/SearchModal.jsx";
import { CartProvider } from "./hooks/useCart.jsx";
import { UiProvider } from "./hooks/useUi.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <UiProvider>
      <CartProvider>
        <ScrollToTop />
        <Shell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalogo" element={<CatalogPage />} />
            <Route path="/produto/:slug" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/favoritos" element={<FavoritesPage />} />
            <Route path="/comparar" element={<ComparePage />} />
          </Routes>
        </Shell>
        <CartDrawer />
        <SearchModal />
        <ToastHost />
      </CartProvider>
    </UiProvider>
  );
}
