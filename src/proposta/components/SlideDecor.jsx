/** Elementos gráficos decorativos animados por slide */
export function SlideDecor({ variant = 0 }) {
  const tones = [
    ["#c41e2a", "#c9a76a"],
    ["#8a1018", "#d4bc8a"],
    ["#e02332", "#a8894f"],
  ][variant % 3];

  return (
    <div className="prop-decor" aria-hidden="true">
      <span className="prop-orb prop-orb--lg" style={{ ["--orb"]: tones[0] }} />
      <span className="prop-orb prop-orb--md" style={{ ["--orb"]: tones[1] }} />
      <span className="prop-orb prop-orb--sm" style={{ ["--orb"]: tones[0] }} />
      <span className="prop-ring prop-ring--a" />
      <span className="prop-ring prop-ring--b" />
      <span className="prop-spark prop-spark--1" />
      <span className="prop-spark prop-spark--2" />
      <span className="prop-spark prop-spark--3" />
      <span className="prop-line prop-line--h" />
      <span className="prop-line prop-line--v" />
    </div>
  );
}
