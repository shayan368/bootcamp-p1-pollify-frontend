export default function AuthInput({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-400">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-lg border border-transparent bg-neutral-100 px-4 py-2.5 text-sm text-black placeholder-neutral-500 outline-none transition focus:border-emerald-500"
      />
    </label>
  );
}
