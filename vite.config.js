import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

const LEGACY = {
  "/index.html": "/",
  "/catalogo.html": "/catalogo",
  "/produto.html": "/produto",
  "/checkout.html": "/checkout",
  "/favoritos.html": "/favoritos",
  "/comparar.html": "/comparar",
};

function legacyHtmlRedirects() {
  return {
    name: "legacy-html-redirects",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        try {
          const url = new URL(req.url || "/", "http://localhost");
          const mapped = LEGACY[url.pathname];
          if (!mapped) return next();
          if (url.pathname === "/produto.html") {
            const slug = url.searchParams.get("slug");
            const dest = slug ? `/produto/${encodeURIComponent(slug)}` : "/catalogo";
            res.statusCode = 302;
            res.setHeader("Location", dest);
            res.end();
            return;
          }
          const qs = url.searchParams.toString();
          res.statusCode = 302;
          res.setHeader("Location", qs ? `${mapped}?${qs}` : mapped);
          res.end();
        } catch {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), legacyHtmlRedirects()],
  resolve: {
    alias: {
      "@": path.join(root, "src"),
    },
  },
  optimizeDeps: {
    entries: ["index.html", "src/**/*.{js,jsx}"],
  },
  server: {
    port: 5173,
    strictPort: true,
    watch: {
      ignored: ["**/legacy/**", "**/js/**", "**/dist/**"],
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    cssCodeSplit: true,
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/gsap")) return "gsap";
          if (id.includes("node_modules/react-dom") || id.includes("node_modules/react/")) {
            return "react";
          }
          if (id.includes("node_modules/react-router")) return "router";
        },
      },
    },
  },
});
