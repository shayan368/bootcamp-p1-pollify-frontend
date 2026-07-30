import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import Logo from "./Logo";
import Avatar from "./Avatar";
import NotificationBell from "./NotificationBell";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(`/dashboard${search ? `?search=${encodeURIComponent(search)}` : ""}`);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-neutral-900 bg-black px-3 sm:gap-4 sm:px-6">
      <Logo />

      {/* search stays visible at every breakpoint - just shrinks/grows to fit */}
      <form onSubmit={submitSearch} className="min-w-0 flex-1 md:mx-auto md:max-w-md">
        <div className="flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-3 py-2 sm:px-4">
          <Search size={16} className="text-neutral-500 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search polls..."
            className="w-full min-w-0 bg-transparent text-sm text-white placeholder-neutral-500 outline-none"
          />
        </div>
      </form>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          onClick={() => navigate("/create-poll")}
          aria-label="Create poll"
          className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400 sm:px-4"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span className="hidden sm:inline">Create</span>
        </button>
        <NotificationBell />
        <button onClick={() => navigate(`/user/${user?.username}`)} aria-label="Your profile" className="shrink-0">
          <Avatar src={user?.avatar} name={user?.name} size={36} className="ring-2 ring-neutral-800" />
        </button>
      </div>
    </header>
  );
}
