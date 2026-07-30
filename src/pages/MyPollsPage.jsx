import { useEffect, useState } from "react";
import { PenSquare } from "lucide-react";
import PollCard from "../components/PollCard";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import * as pollsApi from "../api/polls";

export default function MyPollsPage() {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    pollsApi
      .getPolls({ creator: user.id, limit: 50 })
      .then(({ data }) => setPolls(data.polls))
      .catch(() => setPolls([]))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-white">My Polls</h1>

      {loading ? (
        <p className="py-10 text-center text-sm text-neutral-500">Loading...</p>
      ) : polls.length === 0 ? (
        <EmptyState
          icon={PenSquare}
          title="No polls yet"
          subtitle="You haven't created any polls yet."
          ctaLabel="Create a poll"
          ctaTo="/create-poll"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      )}
    </div>
  );
}
