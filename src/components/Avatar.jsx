export default function Avatar({ src, name, size = 36, className = "" }) {
  const initials = (name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const style = { width: size, height: size };

  if (src) {
    return (
      <img
        src={src}
        alt={name || "avatar"}
        style={style}
        className={`rounded-full object-cover bg-neutral-800 ${className}`}
      />
    );
  }

  return (
    <div
      style={style}
      className={`flex items-center justify-center rounded-full bg-neutral-800 text-neutral-300 font-semibold ${className}`}
    >
      <span style={{ fontSize: size * 0.4 }}>{initials || "?"}</span>
    </div>
  );
}
