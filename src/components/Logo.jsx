import { BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Logo({ to = "/dashboard" }) {
  return (
    <Link to={to} className="flex items-center gap-2 shrink-0">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
        <BarChart3 size={18} className="text-black" strokeWidth={2.5} />
      </span>
      <span className="text-lg font-bold text-white">Pollify</span>
    </Link>
  );
}
