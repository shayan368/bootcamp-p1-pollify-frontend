import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import PollCard from "../components/PollCard";
import EmptyState from "../components/EmptyState";
import * as usersApi from "../api/users";

export default function BookmarkedPollsPage() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersApi
      .getMyBookmarks()
      .then(({ data }) => setPolls(data.polls))
      .catch(() => setPolls([]))
      .finally(() => setLoading(false));
  }, []);

  const handleBookmarkToggle = (pollId, bookmarked) => {
    if (!bookmarked) {
      setPolls((prev) => prev.filter((p) => p.id !== pollId));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-white">Saved</h1>

      {loading ? (
        <p className="py-10 text-center text-sm text-neutral-500">Loading...</p>
      ) : polls.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved polls yet"
          subtitle="Save polls you want to revisit later."
          ctaLabel="Explore polls"
          ctaTo="/dashboard"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} onBookmarkToggle={handleBookmarkToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
