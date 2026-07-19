/** Shell de device wireframe para mockups animados */
export function MockShell({ type = "laptop", title = "Koruvision", children, className = "" }) {
  if (type === "phone") {
    return (
      <div className={`mock-shell mock-shell--phone ${className}`.trim()} data-mock-shell>
        <div className="mock-shell__notch" aria-hidden="true" />
        <div className="mock-shell__screen">{children}</div>
        <div className="mock-shell__home" aria-hidden="true" />
      </div>
    );
  }

  if (type === "tablet") {
    return (
      <div className={`mock-shell mock-shell--tablet ${className}`.trim()} data-mock-shell>
        <div className="mock-shell__chrome">
          <span />
          <span />
          <span />
          <em>{title}</em>
        </div>
        <div className="mock-shell__screen">{children}</div>
      </div>
    );
  }

  if (type === "dashboard") {
    return (
      <div className={`mock-shell mock-shell--dash ${className}`.trim()} data-mock-shell>
        <div className="mock-shell__chrome mock-shell__chrome--dash">
          <span className="mock-shell__dot" />
          <span className="mock-shell__dot" />
          <span className="mock-shell__dot" />
          <em>{title}</em>
        </div>
        <div className="mock-shell__screen mock-shell__screen--dash">{children}</div>
      </div>
    );
  }

  return (
    <div className={`mock-shell mock-shell--laptop ${className}`.trim()} data-mock-shell>
      <div className="mock-shell__lid">
        <div className="mock-shell__chrome">
          <span />
          <span />
          <span />
          <em>{title}</em>
        </div>
        <div className="mock-shell__screen">{children}</div>
      </div>
      <div className="mock-shell__base" aria-hidden="true" />
    </div>
  );
}
