import { mountShell, updateSideBadges } from "./ui/header.js";
import { initSearch } from "./ui/search-modal.js";
import { renderCartDrawer, updateBadges } from "./ui/drawer-cart.js";
import { favorites } from "./store/favorites.js";
import { compare } from "./store/compare.js";
import { toast } from "./ui/toast.js";
import { store } from "./store/storage.js";

export async function boot(pageInit) {
  await mountShell();
  await initSearch();
  updateBadges();
  updateSideBadges();

  // Global fav/compare buttons
  document.addEventListener("click", (e) => {
    const favBtn = e.target.closest("[data-fav]");
    if (favBtn) {
      e.preventDefault();
      const id = favBtn.dataset.fav;
      const list = favorites.toggle(id);
      favBtn.setAttribute("aria-pressed", String(list.includes(id)));
      updateSideBadges();
      toast(list.includes(id) ? "Adicionado aos favoritos" : "Removido dos favoritos", "success");
    }
    const cmpBtn = e.target.closest("[data-compare]");
    if (cmpBtn) {
      e.preventDefault();
      const id = cmpBtn.dataset.compare;
      const list = compare.toggle(id);
      cmpBtn.setAttribute("aria-pressed", String(list.includes(id)));
      updateSideBadges();
      toast(list.includes(id) ? "Adicionado à comparação" : "Removido da comparação", "success");
    }
  });

  store.subscribe((key) => {
    if (key === "dg_favorites" || key === "dg_compare") updateSideBadges();
  });

  if (typeof pageInit === "function") await pageInit();
}

// Ensure drawer container exists
if (!document.getElementById("cartDrawer")) {
  const el = document.createElement("div");
  el.id = "cartDrawer";
  el.className = "drawer";
  document.body.appendChild(el);
}

void renderCartDrawer;
