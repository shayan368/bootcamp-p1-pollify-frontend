import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import { useAuth } from "../context/AuthContext";

export default function ProfileCard() {
  const { user, stats } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="rounded-2xl border border-neutral-900 bg-neutral-950 p-5 text-center">
      <Avatar src={user.avatar} name={user.name} size={80} className="mx-auto ring-2 ring-neutral-800" />
      <p className="mt-3 font-bold text-white">{user.name}</p>
      <p className="text-sm text-neutral-500">@{user.username}</p>

      <div className="my-4 grid grid-cols-3 divide-x divide-neutral-900 border-t border-neutral-900 pt-4">
        <Stat value={stats?.pollCount ?? 0} label="Created" />
        <Stat value={stats?.votedCount ?? 0} label="Voted" />
        <Stat value={stats?.bookmarkCount ?? 0} label="Saved" />
      </div>

      <button
        onClick={() => navigate(`/user/${user.username}`)}
        className="w-full rounded-lg bg-neutral-900 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
      >
        View profile
      </button>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-500">{label}</p>
    </div>
  );
}
