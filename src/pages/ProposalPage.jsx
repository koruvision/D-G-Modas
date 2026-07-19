import { useCallback, useEffect, useState } from "react";
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
import { useProposalAnimations } from "../proposta/useProposalAnimations.js";
import "../proposta/proposta.css";

export function ProposalPage() {
  const [activeId, setActiveId] = useState("capa");

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

    document.documentElement.classList.add("prop-root");
    return () => {
      document.title = prev;
      if (created) robots.remove();
      else if (prevContent != null) robots.setAttribute("content", prevContent);
      else robots.removeAttribute("content");
      document.documentElement.classList.remove("prop-root");
    };
  }, []);

  const onActiveSection = useCallback((id) => setActiveId(id), []);
  useProposalAnimations({ onActiveSection });

  const explore = () => {
    document.getElementById("problema")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="prop-page">
      <ProposalChrome activeId={activeId} />
      <main>
        <HeroSection onExplore={explore} />
        <ProblemSection />
        <EcosystemSection />
        <EcommerceSection />
        <CatalogSection />
        <LandingSection />
        <SocialSection />
        <PostsSection />
        <TrafficSection />
        <BlingSection />
        <CrmSection />
        <CombosSection />
        <ClosingSection />
      </main>
      <footer className="prop-footer">
        <p>
          Koruvision · Tecnologia, marketing e automação · Proposta confidencial para D&amp;G Modas
        </p>
      </footer>
    </div>
  );
}
