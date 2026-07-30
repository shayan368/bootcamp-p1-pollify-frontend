import { NavLink, useNavigate } from "react-router-dom";
import { LayoutGrid, PlusSquare, PenSquare, CheckCircle2, Bookmark, Settings, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/create-poll", label: "Create", icon: PlusSquare },
  { to: "/my-polls", label: "My Polls", icon: PenSquare },
  { to: "/voted-polls", label: "Voted", icon: CheckCircle2 },
  { to: "/bookmarked-polls", label: "Saved", icon: Bookmark },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-emerald-500/10 text-emerald-400"
        : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
    }`;

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 flex-col justify-between overflow-y-auto py-6 pr-4 md:flex">
      <div>
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-600">Menu</p>
        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-1 border-t border-neutral-900 pt-4">
        <NavLink to="/settings" className={linkClass}>
          <Settings size={18} />
          Settings
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </aside>
  );
}
