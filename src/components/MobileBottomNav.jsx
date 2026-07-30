import { NavLink } from "react-router-dom";
import { LayoutGrid, PlusSquare, PenSquare, CheckCircle2, Bookmark } from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Home", icon: LayoutGrid },
  { to: "/my-polls", label: "Mine", icon: PenSquare },
  { to: "/create-poll", label: "Create", icon: PlusSquare },
  { to: "/voted-polls", label: "Voted", icon: CheckCircle2 },
  { to: "/bookmarked-polls", label: "Saved", icon: Bookmark },
];

export default function MobileBottomNav() {
  const linkClass = ({ isActive }) =>
    `flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition ${
      isActive ? "text-emerald-400" : "text-neutral-500"
    }`;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-neutral-900 bg-black/95 backdrop-blur md:hidden">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={linkClass}>
          {({ isActive }) => (
            <>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  isActive ? "bg-emerald-500/10" : ""
                }`}
              >
                <Icon size={19} />
              </span>
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
