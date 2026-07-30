import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Compass, Users, PenSquare, ListChecks, HelpCircle, Star, Image as ImageIcon, MessageSquare } from "lucide-react";
import Avatar from "../components/Avatar";
import PollCard from "../components/PollCard";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import * as pollsApi from "../api/polls";

const FILTERS = [
  { key: "all", label: "All", icon: Compass },
  { key: "yesno", label: "Yes / No", icon: HelpCircle },
  { key: "single", label: "Single Choice", icon: ListChecks },
  { key: "rating", label: "Rating", icon: Star },
  { key: "image", label: "Image", icon: ImageIcon },
  { key: "open", label: "Open Ended", icon: MessageSquare },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const [tab, setTab] = useState("explore"); // "explore" | "following"
  const [filter, setFilter] = useState("all");
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const firstName = user?.name?.split(" ")[0];

  const load = useCallback(
    async (pageNum = 1, append = false) => {
      setLoading(true);
      try {
        const params = { page: pageNum, limit: 10 };
        if (filter !== "all") params.type = filter;
        if (search) params.search = search;
        if (tab === "following") params.following = "true";

        const { data } = await pollsApi.getPolls(params);
        setPolls((prev) => (append ? [...prev, ...data.polls] : data.polls));
        setPage(data.page);
        setPages(data.pages);
      } catch {
        if (!append) setPolls([]);
      } finally {
        setLoading(false);
      }
    },
    [filter, search, tab]
  );

  useEffect(() => {
    load(1, false);
  }, [load]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Hey, {firstName} 👋</h1>
        <p className="text-sm text-neutral-500">What's the community thinking today?</p>
      </div>

      <button
        onClick={() => navigate("/create-poll")}
        className="flex items-center gap-3 rounded-2xl border border-neutral-900 bg-neutral-950 p-3 text-left"
      >
        <Avatar src={user?.avatar} name={user?.name} size={38} />
        <span className="flex-1 text-sm text-neutral-500">Ask the community something...</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-black">
          <PenSquare size={16} />
        </span>
      </button>

      <div className="flex items-center gap-1 rounded-full border border-neutral-900 bg-neutral-950 p-1 w-fit">
        <TabButton active={tab === "explore"} onClick={() => setTab("explore")} icon={Compass} label="Explore" />
        <TabButton active={tab === "following"} onClick={() => setTab("following")} icon={Users} label="Following" />
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-900 pb-4">
        {FILTERS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              filter === key
                ? "bg-white text-black"
                : "bg-neutral-900 text-neutral-400 hover:text-white"
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {loading && polls.length === 0 ? (
        <p className="py-10 text-center text-sm text-neutral-500">Loading polls...</p>
      ) : polls.length === 0 ? (
        <EmptyState
          icon={Compass}
          title={tab === "following" ? "No polls from people you follow yet" : "No polls yet"}
          subtitle={
            tab === "following"
              ? "Follow more people to see their polls here."
              : "Be the first to ask the community something."
          }
          ctaLabel="Create a poll"
          ctaTo="/create-poll"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
          {page < pages && (
            <button
              onClick={() => load(page + 1, true)}
              disabled={loading}
              className="mx-auto rounded-full border border-neutral-800 px-5 py-2 text-sm font-medium text-neutral-400 transition hover:text-white disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active ? "bg-neutral-100 text-black" : "text-neutral-400 hover:text-white"
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}
