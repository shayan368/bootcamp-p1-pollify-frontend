import { useNavigate } from "react-router-dom";

export default function EmptyState({ icon: Icon, title, subtitle, ctaLabel, ctaTo }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-900 bg-neutral-950 px-6 py-16 text-center">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
          <Icon size={26} />
        </div>
      )}
      <p className="font-bold text-white">{title}</p>
      {subtitle && <p className="mt-1 max-w-xs text-sm text-neutral-500">{subtitle}</p>}
      {ctaLabel && (
        <button
          onClick={() => navigate(ctaTo)}
          className="mt-5 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
