import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import PollCard from "../components/PollCard";
import EmptyState from "../components/EmptyState";
import * as pollsApi from "../api/polls";

export default function VotedPollsPage() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pollsApi
      .getMyVotedPolls()
      .then(({ data }) => setPolls(data.polls))
      .catch(() => setPolls([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-white">Voted Polls</h1>

      {loading ? (
        <p className="py-10 text-center text-sm text-neutral-500">Loading...</p>
      ) : polls.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No votes yet"
          subtitle="You haven't voted on any polls yet."
          ctaLabel="Explore polls"
          ctaTo="/dashboard"
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
