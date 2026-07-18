export function PageHero({ label, title, script, children, className = "" }) {
  return (
    <div className={`page-hero reveal-lux ${className}`.trim()}>
      <div className="container">
        <div className="section-label">{label}</div>
        <h1>
          {title} {script ? <span className="script">{script}</span> : null}
        </h1>
        {children}
      </div>
    </div>
  );
}
