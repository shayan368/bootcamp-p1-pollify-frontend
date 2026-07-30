import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { PenSquare, UserPlus, UserCheck } from "lucide-react";
import Avatar from "../components/Avatar";
import PollCard from "../components/PollCard";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import * as usersApi from "../api/users";
import * as pollsApi from "../api/polls";

export default function UserProfilePage() {
  const { username } = useParams();
  const { user: me } = useAuth();
  const [profile, setProfile] = useState(null);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followBusy, setFollowBusy] = useState(false);

  const isOwnProfile = me?.username === username;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await usersApi.getUserByUsername(username);
      setProfile(data);
      const pollsRes = await pollsApi.getPolls({ creator: data.user._id, limit: 50 });
      setPolls(pollsRes.data.polls);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleFollow = async () => {
    if (!profile) return;
    setFollowBusy(true);
    try {
      const { data } = await usersApi.followUser(profile.user._id);
      setProfile((prev) => ({
        ...prev,
        isFollowing: data.following,
        followerCount: prev.followerCount + (data.following ? 1 : -1),
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Couldn't update follow status");
    } finally {
      setFollowBusy(false);
    }
  };

  if (loading) {
    return <p className="py-10 text-center text-sm text-neutral-500">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="py-10 text-center text-sm text-neutral-500">User not found.</p>;
  }

  const { user, pollCount, votedCount, followingCount, followerCount, isFollowing } = profile;

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-2xl border border-neutral-900 bg-neutral-950">
        <div className="h-24 bg-gradient-to-r from-emerald-900/40 via-neutral-900 to-neutral-900" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex items-end justify-between">
            <Avatar src={user.avatar} name={user.name} size={80} className="ring-4 ring-neutral-950" />
            {isOwnProfile ? (
              <a
                href="/settings"
                className="flex items-center gap-1.5 rounded-lg border border-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-900"
              >
                <PenSquare size={14} /> Edit profile
              </a>
            ) : (
              <button
                onClick={toggleFollow}
                disabled={followBusy}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${
                  isFollowing
                    ? "border border-neutral-800 text-white hover:bg-neutral-900"
                    : "bg-emerald-500 text-black hover:bg-emerald-400"
                }`}
              >
                {isFollowing ? <UserCheck size={14} /> : <UserPlus size={14} />}
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>

          <p className="mt-3 text-lg font-bold text-white">{user.name}</p>
          <p className="text-sm text-neutral-500">@{user.username}</p>
          {user.bio && <p className="mt-2 text-sm text-neutral-300">{user.bio}</p>}

          <div className="mt-4 flex gap-6 border-t border-neutral-900 pt-4 text-sm">
            <StatInline value={pollCount} label="Polls" />
            <StatInline value={followerCount} label="Followers" />
            <StatInline value={followingCount} label="Following" />
            <StatInline value={votedCount} label="Voted" />
          </div>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Polls by {user.name}
        </p>
        {polls.length === 0 ? (
          <EmptyState title="No polls yet." />
        ) : (
          <div className="flex flex-col gap-4">
            {polls.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatInline({ value, label }) {
  return (
    <span className="text-neutral-400">
      <span className="font-bold text-white">{value}</span> {label}
    </span>
  );
}
