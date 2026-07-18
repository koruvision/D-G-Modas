import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("DG Modas render error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: "2rem",
            background: "#faf7f4",
            color: "#1a1a1a",
            fontFamily: "Outfit, system-ui, sans-serif",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 480 }}>
            <h1 style={{ fontWeight: 400, letterSpacing: "0.04em" }}>Algo deu errado</h1>
            <p style={{ opacity: 0.75, lineHeight: 1.5 }}>
              A página não carregou corretamente. Atualize com Ctrl+F5 ou abra o console (F12) para detalhes.
            </p>
            <pre
              style={{
                textAlign: "left",
                background: "#fff",
                border: "1px solid rgba(26,26,26,0.08)",
                padding: "0.85rem 1rem",
                fontSize: "0.75rem",
                overflow: "auto",
                color: "#8a1018",
              }}
            >
              {String(this.state.error?.message || this.state.error)}
            </pre>
            <button
              type="button"
              className="btn btn--wine"
              style={{ marginTop: "1rem" }}
              onClick={() => window.location.reload()}
            >
              Recarregar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
