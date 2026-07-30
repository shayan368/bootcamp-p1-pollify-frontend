import { useEffect, useState } from "react";
import { TrendingUp, ListChecks, HelpCircle, Star, Image as ImageIcon, MessageSquare } from "lucide-react";
import { getPollTypeCounts } from "../api/polls";

const TYPES = [
  { key: "single", label: "Single Choice", icon: ListChecks, bar: "bg-emerald-500" },
  { key: "yesno", label: "Yes / No", icon: HelpCircle, bar: "bg-blue-400" },
  { key: "rating", label: "Rating", icon: Star, bar: "bg-violet-400" },
  { key: "image", label: "Image", icon: ImageIcon, bar: "bg-amber-400" },
  { key: "open", label: "Open Ended", icon: MessageSquare, bar: "bg-rose-400" },
];

export default function PollTypeStats() {
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    getPollTypeCounts()
      .then(({ data }) => setCounts(data.counts))
      .catch(() => setCounts(null));
  }, []);

  const max = counts ? Math.max(1, ...Object.values(counts)) : 1;

  return (
    <div className="rounded-2xl border border-neutral-900 bg-neutral-950 p-5">
      <div className="mb-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-400">
        <TrendingUp size={14} />
        Poll Types
      </div>
      <div className="flex flex-col gap-3.5">
        {TYPES.map(({ key, label, icon: Icon, bar }) => {
          const count = counts?.[key] ?? 0;
          return (
            <div key={key}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-neutral-300">
                  <Icon size={14} className="text-neutral-500" />
                  {label}
                </span>
                <span className="font-semibold text-white">{count}</span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-900">
                <div
                  className={`h-full rounded-full ${bar}`}
                  style={{ width: `${Math.max(4, (count / max) * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
