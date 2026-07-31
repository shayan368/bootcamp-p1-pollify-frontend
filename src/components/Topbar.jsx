import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Settings, LogOut, User as UserIcon } from "lucide-react";
import Logo from "./Logo";
import Avatar from "./Avatar";
import NotificationBell from "./NotificationBell";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(`/dashboard${search ? `?search=${encodeURIComponent(search)}` : ""}`);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-neutral-900 bg-black px-3 sm:gap-4 sm:px-6">
      <Logo />

      {/* Responsive Search */}
      <div className={`flex-1 md:mx-auto md:max-w-md ${isSearchExpanded ? 'absolute inset-x-2 top-2 z-50 rounded-xl bg-neutral-900 p-2 shadow-2xl md:static md:bg-transparent md:p-0 md:shadow-none' : 'hidden md:block'}`}>
        <form onSubmit={submitSearch} className="flex min-w-0 w-full items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-3 py-2 sm:px-4">
            <Search size={16} className="text-neutral-500 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search polls..."
              className="w-full min-w-0 bg-transparent text-sm text-white placeholder-neutral-500 outline-none"
              autoFocus={isSearchExpanded}
            />
          </div>
          {isSearchExpanded && (
            <button
              type="button"
              onClick={() => setIsSearchExpanded(false)}
              className="px-2 text-sm font-medium text-neutral-400 hover:text-white md:hidden"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        {!isSearchExpanded && (
          <button
            onClick={() => setIsSearchExpanded(true)}
            className="flex items-center justify-center p-2 text-neutral-400 hover:text-white md:hidden"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
        )}
        <button
          onClick={() => navigate("/create-poll")}
          aria-label="Create poll"
          className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400 sm:px-4"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span className="hidden sm:inline">Create</span>
        </button>
        <NotificationBell />
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
            aria-label="Your profile" 
            className="shrink-0 block"
          >
            <Avatar src={user?.avatar} name={user?.name} size={36} className="ring-2 ring-neutral-800" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-neutral-800 bg-neutral-950 p-1 shadow-xl">
              <button
                onClick={() => {
                  navigate(`/user/${user?.username}`);
                  setIsDropdownOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-900 hover:text-white"
              >
                <UserIcon size={16} />
                View Profile
              </button>
              <button
                onClick={() => {
                  navigate("/settings");
                  setIsDropdownOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-900 hover:text-white"
              >
                <Settings size={16} />
                Settings
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                  setIsDropdownOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
