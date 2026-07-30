import { Users, TrendingUp, Zap } from "lucide-react";
import Logo from "./Logo";

const stats = [
  { icon: Users, value: "50K+", label: "Community members" },
  { icon: TrendingUp, value: "2M+", label: "Votes cast" },
  { icon: Zap, value: "500K+", label: "Polls created" },
];

export default function AuthShell({ children }) {
  return (
    <div className="flex min-h-screen bg-black">
      {/* left branding panel */}
      <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-950 via-black to-black p-10 lg:flex">
        <div
          className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative">
          <Logo to="/login" />
          <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live community
          </span>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.1] text-white">
            Every opinion
            <br />
            <span className="text-emerald-400">deserves to</span>
            <br />
            be counted.
          </h1>
          <p className="mt-5 max-w-sm text-neutral-400">
            Create polls in seconds, collect votes instantly, and discover what your community truly
            thinks.
          </p>
        </div>

        <div className="relative flex gap-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
            >
              <Icon size={18} className="mb-2 text-emerald-400" />
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-xs text-neutral-500">{label}</p>
            </div>
          ))}
        </div>

        <p className="relative text-xs text-neutral-600">© 2026 Pollify · Made for the community</p>
      </div>

      {/* right form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
