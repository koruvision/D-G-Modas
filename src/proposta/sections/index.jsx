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
  DeviceFrame,
  FeatureChips,
  HorizontalCarousel,
  IconTile,
  PlanCard,
  PropImage,
  SectionHead,
} from "../components/ui.jsx";

export function ProblemSection() {
  return (
    <section className="prop-section prop-problem" id="problema">
      <div className="prop-wrap">
        <SectionHead icon="alert" title={PROBLEM.title} subtitle={PROBLEM.subtitle} />
        <div className="prop-grid prop-grid--4" data-stagger>
          {PROBLEM.points.map((p) => (
            <IconTile key={p.title} icon={p.icon} title={p.title} text={p.text} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function EcosystemSection() {
  return (
    <section className="prop-section" id="ecossistema">
      <div className="prop-wrap">
        <SectionHead icon="layers" title={ECOSYSTEM.title} subtitle={ECOSYSTEM.subtitle} />
        <div className="prop-eco">
          <div className="prop-eco__visual" data-reveal>
            <PropImage src="/assets/proposta/ecosystem-map.webp" alt="Mapa do ecossistema D&G Modas" />
          </div>
          <div className="prop-eco__pillars" data-stagger>
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
        </div>
      </div>
    </section>
  );
}

export function EcommerceSection() {
  return (
    <section className="prop-section" id="ecommerce">
      <div className="prop-wrap">
        <SectionHead icon="store" eyebrow="01 · Vendas online" title={ECOMMERCE.title} subtitle={ECOMMERCE.subtitle} />
        <div className="prop-split">
          <DeviceFrame type="laptop" className="prop-split__media" data-reveal>
            <PropImage src={ECOMMERCE.image} alt="Mockup e-commerce" />
          </DeviceFrame>
          <FeatureChips items={ECOMMERCE.benefits} />
        </div>
        <p className="prop-note" data-reveal>
          {ECOMMERCE.note}
        </p>
        <p className="prop-note prop-note--soft" data-reveal>
          {ECOMMERCE.support}
        </p>
        <HorizontalCarousel>
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
        <SectionHead icon="qr" eyebrow="02 · Vitrine rápida" title={CATALOG.title} subtitle={CATALOG.subtitle} />
        <div className="prop-split prop-split--reverse">
          <FeatureChips items={CATALOG.benefits} />
          <DeviceFrame type="phone" className="prop-split__media" data-reveal>
            <PropImage src={CATALOG.image} alt="Catálogo no celular" />
          </DeviceFrame>
        </div>
        <div className="prop-price-inline" data-reveal>
          <strong>{CATALOG.price}</strong>
          <span>{CATALOG.period}</span>
        </div>
      </div>
    </section>
  );
}

export function LandingSection() {
  return (
    <section className="prop-section" id="landing">
      <div className="prop-wrap">
        <SectionHead icon="layout" eyebrow="03 · Conversão" title={LANDING.title} subtitle={LANDING.subtitle} />
        <div className="prop-split">
          <DeviceFrame type="tablet" className="prop-split__media" data-reveal>
            <PropImage src={LANDING.image} alt="Landing page" />
          </DeviceFrame>
          <div>
            <FeatureChips items={LANDING.uses} />
            <p className="prop-note" data-reveal>
              {LANDING.note}
            </p>
            <div className="prop-price-inline" data-reveal>
              <strong>{LANDING.price}</strong>
              <span>{LANDING.period}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SocialSection() {
  return (
    <section className="prop-section prop-section--alt" id="social">
      <div className="prop-wrap">
        <SectionHead icon="instagram" eyebrow="04 · Marca viva" title={SOCIAL.title} subtitle={SOCIAL.subtitle} />
        <div className="prop-media-wide" data-reveal>
          <PropImage src={SOCIAL.image} alt="Grade de redes sociais" />
        </div>
        <HorizontalCarousel>
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
        <SectionHead icon="calendar" eyebrow="05 · Plataforma Koruvision" title={POSTS.title} subtitle={POSTS.subtitle} />
        <div className="prop-split">
          <DeviceFrame type="laptop" data-reveal>
            <PropImage src={POSTS.image} alt="Calendário Koruvision Posts" />
          </DeviceFrame>
          <div>
            <h3 className="prop-subhead" data-reveal>
              <Icon name="grid" className="icon prop-subhead__ico" /> Recursos
            </h3>
            <FeatureChips items={POSTS.features} />
            <h3 className="prop-subhead" data-reveal>
              <Icon name="share" className="icon prop-subhead__ico" /> Plataformas
            </h3>
            <FeatureChips items={POSTS.platforms} />
          </div>
        </div>
        <div className="prop-ai-block" data-reveal>
          <div>
            <Badge>IA integrada</Badge>
            <h3>
              <Icon name="bot" className="icon prop-subhead__ico" /> A inteligência artificial trabalhando por você
            </h3>
            <FeatureChips items={POSTS.ai} />
          </div>
          <PropImage src={POSTS.imageAi} alt="IA no Koruvision Posts" className="prop-ai-block__img" />
        </div>
        <HorizontalCarousel>
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
        <SectionHead icon="megaphone" eyebrow="06 · Aquisição" title={TRAFFIC.title} subtitle={TRAFFIC.subtitle} />
        <div className="prop-split">
          <FeatureChips items={TRAFFIC.services} />
          <div className="prop-media-wide" data-reveal>
            <PropImage src={TRAFFIC.image} alt="Dashboard de tráfego" />
          </div>
        </div>
        <HorizontalCarousel>
          {TRAFFIC.plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} accent={plan.badge === "PACOTE COMPLETO"} />
          ))}
        </HorizontalCarousel>
        <p className="prop-note" data-reveal>
          {TRAFFIC.note}
        </p>
      </div>
    </section>
  );
}

export function BlingSection() {
  return (
    <section className="prop-section" id="bling">
      <div className="prop-wrap">
        <SectionHead icon="package" eyebrow="07 · Operação" title={BLING.title} subtitle={BLING.subtitle} />
        <div className="prop-split">
          <DeviceFrame type="laptop" data-reveal>
            <PropImage src={BLING.image} alt="Dashboard Bling" />
          </DeviceFrame>
          <FeatureChips items={BLING.benefits} />
        </div>
        <HorizontalCarousel>
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
        <SectionHead icon="chat" eyebrow="08 · Relacionamento" title={CRM.title} subtitle={CRM.subtitle} />
        <div className="prop-split">
          <DeviceFrame type="laptop" data-reveal>
            <PropImage src={CRM.image} alt="CRM Kanban" />
          </DeviceFrame>
          <div className="prop-crm-groups" data-stagger>
            {CRM.features.map((g) => (
              <article key={g.group} className="prop-glass" data-reveal>
                <h3>
                  <Icon name={g.icon} className="icon prop-subhead__ico" /> {g.group}
                </h3>
                <ul>
                  {g.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
        <p className="prop-note" data-reveal>
          {CRM.note}
        </p>
      </div>
    </section>
  );
}

export function CombosSection() {
  return (
    <section className="prop-section" id="combos">
      <div className="prop-wrap">
        <SectionHead icon="gift" title={COMBOS.title} subtitle={COMBOS.subtitle} />
        <div className="prop-media-wide prop-media-wide--short" data-reveal>
          <PropImage src="/assets/proposta/combos-visual.webp" alt="Combos Koruvision para D&G Modas" />
        </div>
        <HorizontalCarousel className="prop-carousel--combos">
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
      <div className="prop-wrap prop-closing__inner">
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
    </section>
  );
}
