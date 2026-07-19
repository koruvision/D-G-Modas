import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProposalChrome } from "../proposta/ProposalChrome.jsx";
import { HeroSection } from "../proposta/sections/HeroSection.jsx";
import {
  ProblemSection,
  EcosystemSection,
  EcommerceSection,
  CatalogSection,
  LandingSection,
  SocialSection,
  PostsSection,
  TrafficSection,
  BlingSection,
  CrmSection,
  CombosSection,
  ClosingSection,
} from "../proposta/sections/index.jsx";
import { SECTIONS } from "../proposta/data/proposalContent.js";
import { useProposalDeck } from "../proposta/useProposalDeck.js";
import { useSlideInteractions } from "../proposta/useSlideInteractions.js";
import { SlideDecor } from "../proposta/components/SlideDecor.jsx";
import { assetUrl } from "../lib/utils.js";
import { Icon } from "../components/Icon.jsx";
import "../proposta/proposta.css";

const SLIDE_BACKGROUNDS = {
  capa: "assets/hero-loja.webp",
  problema: "assets/banner-hero-1.webp",
  ecossistema: "assets/familia-imperio.webp",
  ecommerce: "assets/banner-hero-2.webp",
  catalogo: "assets/cat-feminino.webp",
  landing: "assets/banner-hero-3.webp",
  social: "assets/cat-masculino.webp",
  posts: "assets/banner-coroa.webp",
  trafego: "assets/hero-modelo.webp",
  bling: "assets/cat-infantil.webp",
  crm: "assets/hero-full.webp",
  combos: "assets/logo-imperial.webp",
  fechamento: "assets/hero-loja.webp",
};

export function ProposalPage() {
  const [index, setIndex] = useState(0);
  const trackRef = useRef(null);
  const activeId = SECTIONS[index]?.id || "capa";

  const slides = useMemo(
    () => [
      { id: "capa", node: <HeroSection onExplore={() => setIndex(1)} /> },
      { id: "problema", node: <ProblemSection /> },
      { id: "ecossistema", node: <EcosystemSection /> },
      { id: "ecommerce", node: <EcommerceSection /> },
      { id: "catalogo", node: <CatalogSection /> },
      { id: "landing", node: <LandingSection /> },
      { id: "social", node: <SocialSection /> },
      { id: "posts", node: <PostsSection /> },
      { id: "trafego", node: <TrafficSection /> },
      { id: "bling", node: <BlingSection /> },
      { id: "crm", node: <CrmSection /> },
      { id: "combos", node: <CombosSection /> },
      { id: "fechamento", node: <ClosingSection /> },
    ],
    []
  );

  const goTo = useCallback(
    (next) => {
      setIndex((current) => {
        if (typeof next === "string") {
          const i = SECTIONS.findIndex((s) => s.id === next);
          return i >= 0 ? i : current;
        }
        const max = slides.length - 1;
        return Math.max(0, Math.min(max, next));
      });
    },
    [slides.length]
  );

  useProposalDeck({ index, setIndex, trackRef, total: slides.length });
  useSlideInteractions(index);

  useEffect(() => {
    const prev = document.title;
    document.title = "Proposta Comercial · Koruvision × D&G Modas";

    let robots = document.querySelector('meta[name="robots"]');
    const created = !robots;
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    const prevContent = robots.getAttribute("content");
    robots.setAttribute("content", "noindex, nofollow");

    document.documentElement.classList.add("prop-root", "prop-root--deck");
    document.body.classList.add("prop-body--deck");
    return () => {
      document.title = prev;
      if (created) robots.remove();
      else if (prevContent != null) robots.setAttribute("content", prevContent);
      else robots.removeAttribute("content");
      document.documentElement.classList.remove("prop-root", "prop-root--deck");
      document.body.classList.remove("prop-body--deck");
    };
  }, []);

  return (
    <div className="prop-page prop-page--deck">
      <ProposalChrome activeId={activeId} onNavigate={goTo} />

      <div className="prop-deck" aria-live="polite">
        <div className="prop-deck__track" ref={trackRef}>
          {slides.map((slide, i) => {
            const bg = SLIDE_BACKGROUNDS[slide.id] || "assets/hero-loja.webp";
            return (
              <article
                key={slide.id}
                className={`prop-slide${i === index ? " is-active" : ""}`}
                data-slide={slide.id}
                aria-hidden={i !== index}
              >
                <div
                  className="prop-slide__bg"
                  style={{ backgroundImage: `url(${assetUrl(bg)})` }}
                  aria-hidden="true"
                />
                <div className="prop-slide__veil" aria-hidden="true" />
                <SlideDecor variant={i} />
                <div className="prop-slide__card prop-glass-liquid">
                  <span className="prop-glass-liquid__shine" aria-hidden="true" />
                  {slide.node}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="prop-deck__controls">
        <button
          type="button"
          className="prop-deck__nav prop-deck__nav--prev"
          aria-label="Slide anterior"
          disabled={index === 0}
          onClick={() => goTo(index - 1)}
        >
          <Icon name="chevron" />
        </button>
        <p className="prop-deck__counter">
          {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </p>
        <button
          type="button"
          className="prop-deck__nav prop-deck__nav--next"
          aria-label="Próximo slide"
          disabled={index === slides.length - 1}
          onClick={() => goTo(index + 1)}
        >
          <Icon name="chevron" />
        </button>
      </div>
    </div>
  );
}
