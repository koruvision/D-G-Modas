import { ASSET_FALLBACK } from "../data/proposalContent.js";
import { Icon } from "../../components/Icon.jsx";
import { assetUrl } from "../../lib/utils.js";

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

export function BrandLogos({ size = "md" }) {
  return (
    <div className={`prop-logos prop-logos--${size}`}>
      <img
        className="prop-logos__dg"
        src={assetUrl("assets/logo-header-sm.webp")}
        alt="D&G Modas"
        width="120"
        height="120"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = assetUrl("assets/logo-dg-modas-sm.webp");
        }}
      />
      <span className="prop-logos__x" aria-hidden="true">
        ×
      </span>
      <span className="prop-logos__kv" aria-label="Koruvision">
        KV
      </span>
    </div>
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

function normalizeItem(item) {
  if (typeof item === "string") return { label: item, icon: "check" };
  return { label: item.label || item.text || "", icon: item.icon || "check" };
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
        {(plan.features || plan.includes || []).map((f) => {
          const item = normalizeItem(f);
          return (
            <li key={item.label}>
              <Icon name={item.icon === "check" ? "check" : item.icon || "check"} className="icon prop-plan__ico" />
              <span>{item.label}</span>
            </li>
          );
        })}
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

export function SectionHead({ eyebrow, title, subtitle, accent, icon }) {
  return (
    <header className="prop-section__head" data-reveal>
      {eyebrow && (
        <p className="prop-eyebrow">
          {icon ? <Icon name={icon} className="icon prop-eyebrow__ico" /> : null}
          {eyebrow}
        </p>
      )}
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
      {items.map((raw) => {
        const item = normalizeItem(raw);
        return (
          <li key={item.label} data-reveal>
            <Icon name={item.icon} className="icon prop-chip__ico" />
            <span>{item.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function IconTile({ icon, title, text }) {
  return (
    <article className="prop-glass" data-reveal>
      <span className="prop-icon-wrap" aria-hidden="true">
        <Icon name={icon} className="icon" />
      </span>
      <h3>{title}</h3>
      {text ? <p>{text}</p> : null}
    </article>
  );
}
