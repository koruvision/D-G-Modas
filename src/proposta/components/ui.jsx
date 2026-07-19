import { ASSET_FALLBACK } from "../data/proposalContent.js";

export function PropImage({ src, alt = "", className = "" }) {
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={(e) => {
        if (e.currentTarget.dataset.fb) return;
        e.currentTarget.dataset.fb = "1";
        e.currentTarget.src = ASSET_FALLBACK;
      }}
    />
  );
}

export function Badge({ children, tone = "gold" }) {
  if (!children) return null;
  return <span className={`prop-badge prop-badge--${tone}`}>{children}</span>;
}

export function DeviceFrame({ type = "laptop", children, className = "", ...rest }) {
  return (
    <div className={`prop-device prop-device--${type} ${className}`.trim()} {...rest}>
      <div className="prop-device__bezel">
        <div className="prop-device__screen">{children}</div>
      </div>
      {type === "laptop" && <div className="prop-device__base" aria-hidden="true" />}
    </div>
  );
}

export function PlanCard({ plan, accent }) {
  const featured = Boolean(plan.badge);
  return (
    <article
      className={`prop-plan${featured ? " is-featured" : ""}${accent ? " is-accent" : ""}`}
      data-reveal
    >
      <Badge tone={plan.badge === "SOLUÇÃO COMPLETA" || plan.badge === "PACOTE COMPLETO" ? "wine" : "gold"}>
        {plan.badge}
      </Badge>
      <h3>{plan.name}</h3>
      {plan.desc && <p className="prop-plan__desc">{plan.desc}</p>}
      {plan.ideal && <p className="prop-plan__desc">{plan.ideal}</p>}
      <div className="prop-plan__price">
        <strong>{plan.price}</strong>
        {plan.period && <span>{plan.period}</span>}
      </div>
      <ul>
        {(plan.features || plan.includes || []).map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </article>
  );
}

export function HorizontalCarousel({ children, className = "" }) {
  return (
    <div className={`prop-carousel ${className}`.trim()} data-carousel>
      <div className="prop-carousel__track">{children}</div>
    </div>
  );
}

export function SectionHead({ eyebrow, title, subtitle, accent }) {
  return (
    <header className="prop-section__head" data-reveal>
      {eyebrow && <p className="prop-eyebrow">{eyebrow}</p>}
      <h2>
        {title}
        {accent && (
          <>
            {" "}
            <span className="script prop-accent">{accent}</span>
          </>
        )}
      </h2>
      {subtitle && <p className="prop-lead">{subtitle}</p>}
    </header>
  );
}

export function FeatureChips({ items }) {
  return (
    <ul className="prop-chips" data-stagger>
      {items.map((item) => (
        <li key={item} data-reveal>
          {item}
        </li>
      ))}
    </ul>
  );
}
