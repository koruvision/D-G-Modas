import { useEffect, useRef } from "react";
import { HERO } from "../data/proposalContent.js";
import { PropImage } from "../components/ui.jsx";

export function HeroSection({ onExplore }) {
  const canvasRef = useRef(null);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced || !canvasRef.current) return;
    let disposed = false;
    let renderer;
    let animId;
    let cleanupResize;

    (async () => {
      const THREE = await import("three");
      if (disposed || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.z = 4.2;

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const resize = () => {
        const parent = canvas.parentElement;
        if (!parent) return;
        const w = parent.clientWidth;
        const h = parent.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / Math.max(h, 1);
        camera.updateProjectionMatrix();
      };
      resize();
      cleanupResize = () => window.removeEventListener("resize", resize);
      window.addEventListener("resize", resize);

      const geo = new THREE.IcosahedronGeometry(1.35, 1);
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#c41e2a"),
        metalness: 0.55,
        roughness: 0.35,
        flatShading: true,
        transparent: true,
        opacity: 0.88,
      });
      const mesh = new THREE.Mesh(geo, mat);
      scene.add(mesh);

      const wire = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.55, 1),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color("#c9a76a"),
          wireframe: true,
          transparent: true,
          opacity: 0.35,
        })
      );
      scene.add(wire);

      const light = new THREE.DirectionalLight(0xfff5ea, 1.4);
      light.position.set(2, 3, 4);
      scene.add(light);
      scene.add(new THREE.AmbientLight(0xc9a76a, 0.55));

      const tick = () => {
        if (disposed) return;
        mesh.rotation.x += 0.003;
        mesh.rotation.y += 0.005;
        wire.rotation.x -= 0.002;
        wire.rotation.y += 0.003;
        renderer.render(scene, camera);
        animId = requestAnimationFrame(tick);
      };
      tick();
    })();

    return () => {
      disposed = true;
      if (animId) cancelAnimationFrame(animId);
      cleanupResize?.();
      renderer?.dispose?.();
    };
  }, [reduced]);

  return (
    <section className="prop-section prop-hero" id="capa">
      <div className="prop-hero__glow" aria-hidden="true" />
      <div className="prop-hero__3d" aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>
      <div className="prop-hero__content">
        <p className="prop-eyebrow" data-hero-el>
          {HERO.eyebrow}
        </p>
        <p className="prop-hero__pair" data-hero-el>
          <strong>{HERO.brand}</strong>
          <span>×</span>
          <em className="script">{HERO.partner}</em>
        </p>
        <h1 data-hero-el>{HERO.title}</h1>
        <p className="prop-lead" data-hero-el>
          {HERO.subtitle}
        </p>
        <div className="prop-hero__actions" data-hero-el>
          <button type="button" className="prop-btn prop-btn--wine" onClick={onExplore}>
            {HERO.cta}
          </button>
        </div>
      </div>
      <div className="prop-hero__visual" data-hero-el>
        <PropImage src="/assets/proposta/hero-ecosystem.webp" alt="Ecossistema Koruvision" />
      </div>
    </section>
  );
}
