import { useUi } from "../hooks/useUi.jsx";

export function ToastHost() {
  const { toasts } = useUi();
  if (!toasts.length) return null;

  return (
    <div className="toast-root">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type} is-in`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
