import {
  PROBLEM,
  ECOSYSTEM,
  ECOMMERCE,
  CATALOG,
  LANDING,
  SOCIAL,
  POSTS,
  TRAFFIC,
  BLING,
  CRM,
  COMBOS,
  CLOSING,
  WA_LINK,
} from "../data/proposalContent.js";
import { Icon } from "../../components/Icon.jsx";
import {
  Badge,
  BrandLogos,
  FeatureChips,
  HorizontalCarousel,
  PlanCard,
  SectionHead,
} from "../components/ui.jsx";
import {
  ProblemChaosVisual,
  EcosystemFullVisual,
  StorefrontVisual,
  CatalogPhoneVisual,
  LandingPageVisual,
  SocialFeedVisual,
  PostsStudioVisual,
  AdsFunnelVisual,
  ErpDashboardVisual,
  CrmKanbanVisual,
  ComboBuilderVisual,
  ClosingOrbitVisual,
} from "../visuals/index.js";

function SlideLayout({ copy, visual, className = "" }) {
  return (
    <div className={`prop-slide-layout ${className}`.trim()}>
      <div className="prop-slide-layout__copy" data-reveal>
        {copy}
      </div>
      <div className="prop-slide-layout__visual" data-reveal>
        {visual}
      </div>
    </div>
  );
}

export function ProblemSection() {
  return (
    <section className="prop-section prop-problem" id="problema">
      <div className="prop-wrap">
        <SlideLayout
          visual={<ProblemChaosVisual />}
          copy={
            <>
              <SectionHead icon="alert" title={PROBLEM.title} subtitle={PROBLEM.subtitle} />
              <ul className="prop-point-list">
                {PROBLEM.points.map((p) => (
                  <li key={p.title} data-reveal>
                    <span className="prop-icon-wrap prop-icon-wrap--sm" aria-hidden="true">
                      <Icon name={p.icon} className="icon" />
                    </span>
                    <div>
                      <strong>{p.title}</strong>
                      <span>{p.text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          }
        />
      </div>
    </section>
  );
}

export function EcosystemSection() {
  return (
    <section className="prop-section" id="ecossistema">
      <div className="prop-wrap">
        <SlideLayout
          visual={<EcosystemFullVisual />}
          copy={
            <>
              <SectionHead icon="layers" title={ECOSYSTEM.title} subtitle={ECOSYSTEM.subtitle} />
              <div className="prop-eco__pillars prop-eco__pillars--compact" data-stagger>
                {ECOSYSTEM.pillars.map((p) => (
                  <a key={p.id} className="prop-pillar" href={`#${p.id}`} data-reveal>
                    <span className="prop-icon-wrap prop-icon-wrap--sm" aria-hidden="true">
                      <Icon name={p.icon} className="icon" />
                    </span>
                    <strong>{p.label}</strong>
                    <span>{p.desc}</span>
                  </a>
                ))}
              </div>
            </>
          }
        />
      </div>
    </section>
  );
}

export function EcommerceSection() {
  return (
    <section className="prop-section" id="ecommerce">
      <div className="prop-wrap">
        <SlideLayout
          visual={<StorefrontVisual />}
          copy={
            <>
              <SectionHead icon="store" eyebrow="01 · Vendas online" title={ECOMMERCE.title} subtitle={ECOMMERCE.subtitle} />
              <FeatureChips items={ECOMMERCE.benefits.slice(0, 8)} />
              <p className="prop-note" data-reveal>
                {ECOMMERCE.note}
              </p>
            </>
          }
        />
        <HorizontalCarousel className="prop-carousel--compact">
          {ECOMMERCE.plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </HorizontalCarousel>
      </div>
    </section>
  );
}

export function CatalogSection() {
  return (
    <section className="prop-section prop-section--alt" id="catalogo">
      <div className="prop-wrap">
        <SlideLayout
          className="prop-slide-layout--reverse"
          visual={<CatalogPhoneVisual />}
          copy={
            <>
              <SectionHead icon="qr" eyebrow="02 · Vitrine rápida" title={CATALOG.title} subtitle={CATALOG.subtitle} />
              <FeatureChips items={CATALOG.benefits} />
              <div className="prop-price-inline" data-reveal>
                <strong>{CATALOG.price}</strong>
                <span>{CATALOG.period}</span>
              </div>
            </>
          }
        />
      </div>
    </section>
  );
}

export function LandingSection() {
  return (
    <section className="prop-section" id="landing">
      <div className="prop-wrap">
        <SlideLayout
          visual={<LandingPageVisual />}
          copy={
            <>
              <SectionHead icon="layout" eyebrow="03 · Conversão" title={LANDING.title} subtitle={LANDING.subtitle} />
              <FeatureChips items={LANDING.uses} />
              <p className="prop-note" data-reveal>
                {LANDING.note}
              </p>
              <div className="prop-price-inline" data-reveal>
                <strong>{LANDING.price}</strong>
                <span>{LANDING.period}</span>
              </div>
            </>
          }
        />
      </div>
    </section>
  );
}

export function SocialSection() {
  return (
    <section className="prop-section prop-section--alt" id="social">
      <div className="prop-wrap">
        <SlideLayout
          visual={<SocialFeedVisual />}
          copy={
            <>
              <SectionHead icon="instagram" eyebrow="04 · Marca viva" title={SOCIAL.title} subtitle={SOCIAL.subtitle} />
              <p className="prop-note" data-reveal>
                Conteúdo, calendário e presença com identidade D&G — wireframe do feed em tempo real.
              </p>
            </>
          }
        />
        <HorizontalCarousel className="prop-carousel--compact">
          {SOCIAL.plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </HorizontalCarousel>
      </div>
    </section>
  );
}

export function PostsSection() {
  return (
    <section className="prop-section" id="posts">
      <div className="prop-wrap">
        <SlideLayout
          visual={<PostsStudioVisual />}
          copy={
            <>
              <SectionHead icon="calendar" eyebrow="05 · Plataforma Koruvision" title={POSTS.title} subtitle={POSTS.subtitle} />
              <h3 className="prop-subhead" data-reveal>
                <Icon name="grid" className="icon prop-subhead__ico" /> Recursos
              </h3>
              <FeatureChips items={POSTS.features} />
              <h3 className="prop-subhead" data-reveal>
                <Icon name="bot" className="icon prop-subhead__ico" /> IA
              </h3>
              <FeatureChips items={POSTS.ai} />
              <Badge>IA integrada</Badge>
            </>
          }
        />
        <HorizontalCarousel className="prop-carousel--compact">
          {POSTS.plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </HorizontalCarousel>
      </div>
    </section>
  );
}

export function TrafficSection() {
  return (
    <section className="prop-section prop-section--alt" id="trafego">
      <div className="prop-wrap">
        <SlideLayout
          visual={<AdsFunnelVisual />}
          copy={
            <>
              <SectionHead icon="megaphone" eyebrow="06 · Aquisição" title={TRAFFIC.title} subtitle={TRAFFIC.subtitle} />
              <FeatureChips items={TRAFFIC.services} />
              <p className="prop-note" data-reveal>
                {TRAFFIC.note}
              </p>
            </>
          }
        />
        <HorizontalCarousel className="prop-carousel--compact">
          {TRAFFIC.plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} accent={plan.badge === "PACOTE COMPLETO"} />
          ))}
        </HorizontalCarousel>
      </div>
    </section>
  );
}

export function BlingSection() {
  return (
    <section className="prop-section" id="bling">
      <div className="prop-wrap">
        <SlideLayout
          visual={<ErpDashboardVisual />}
          copy={
            <>
              <SectionHead icon="package" eyebrow="07 · Operação" title={BLING.title} subtitle={BLING.subtitle} />
              <FeatureChips items={BLING.benefits} />
            </>
          }
        />
        <HorizontalCarousel className="prop-carousel--compact">
          {BLING.plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </HorizontalCarousel>
      </div>
    </section>
  );
}

export function CrmSection() {
  return (
    <section className="prop-section prop-section--alt" id="crm">
      <div className="prop-wrap">
        <SlideLayout
          visual={<CrmKanbanVisual />}
          copy={
            <>
              <SectionHead icon="chat" eyebrow="08 · Relacionamento" title={CRM.title} subtitle={CRM.subtitle} />
              <div className="prop-crm-groups prop-crm-groups--compact" data-stagger>
                {CRM.features.map((g) => (
                  <article key={g.group} className="prop-glass" data-reveal>
                    <h3>
                      <Icon name={g.icon} className="icon prop-subhead__ico" /> {g.group}
                    </h3>
                    <ul>
                      {g.items.slice(0, 3).map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
              <p className="prop-note" data-reveal>
                {CRM.note}
              </p>
            </>
          }
        />
      </div>
    </section>
  );
}

export function CombosSection() {
  return (
    <section className="prop-section" id="combos">
      <div className="prop-wrap">
        <SlideLayout
          visual={<ComboBuilderVisual />}
          copy={
            <>
              <SectionHead icon="gift" title={COMBOS.title} subtitle={COMBOS.subtitle} />
              <p className="prop-note" data-reveal>
                Blocos de serviço se encaixam em pacotes — visualize a montagem do combo no gráfico ao lado.
              </p>
            </>
          }
        />
        <HorizontalCarousel className="prop-carousel--combos prop-carousel--compact">
          {COMBOS.items.map((item) => (
            <PlanCard key={item.name} plan={item} accent={Boolean(item.badge)} />
          ))}
        </HorizontalCarousel>
      </div>
    </section>
  );
}

export function ClosingSection() {
  return (
    <section className="prop-section prop-closing" id="fechamento">
      <div className="prop-wrap">
        <SlideLayout
          className="prop-slide-layout--closing"
          visual={<ClosingOrbitVisual />}
          copy={
            <div className="prop-closing__inner">
              <div data-reveal>
                <BrandLogos size="lg" />
              </div>
              <p className="prop-eyebrow" data-reveal>
                Próximo passo
              </p>
              <h2 data-reveal>
                {CLOSING.title}
                <br />
                <span className="script prop-accent">{CLOSING.accent}</span>
              </h2>
              <p className="prop-lead" data-reveal>
                {CLOSING.subtitle}
              </p>
              <div className="prop-triggers" data-stagger>
                {CLOSING.triggers.map((t) => (
                  <span key={t.label} data-reveal>
                    <Icon name={t.icon} className="icon prop-chip__ico" />
                    {t.label}
                  </span>
                ))}
              </div>
              <a className="prop-btn prop-btn--wine prop-btn--lg" href={WA_LINK} target="_blank" rel="noreferrer" data-reveal>
                <Icon name="chat" className="icon" /> {CLOSING.cta}
              </a>
            </div>
          }
        />
      </div>
    </section>
  );
}
