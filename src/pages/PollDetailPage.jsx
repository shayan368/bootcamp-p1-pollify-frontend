import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Trash2 } from "lucide-react";
import Avatar from "../components/Avatar";
import PollCard from "../components/PollCard";
import { useAuth } from "../context/AuthContext";
import * as pollsApi from "../api/polls";
import * as commentsApi from "../api/comments";

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function PollDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [poll, setPoll] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pollRes, commentsRes] = await Promise.all([
        pollsApi.getPollById(id),
        commentsApi.getComments(id),
      ]);
      setPoll(pollRes.data.poll);
      setComments(commentsRes.data.comments);
    } catch {
      setPoll(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setPosting(true);
    try {
      const { data } = await commentsApi.addComment(id, text.trim());
      setComments((prev) => [data.comment, ...prev]);
      setText("");
    } catch (err) {
      alert(err.response?.data?.message || "Couldn't post your comment");
    } finally {
      setPosting(false);
    }
  };

  const removeComment = async (commentId) => {
    try {
      await commentsApi.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      alert(err.response?.data?.message || "Couldn't delete comment");
    }
  };

  if (loading) return <p className="py-10 text-center text-sm text-neutral-500">Loading poll...</p>;
  if (!poll) return <p className="py-10 text-center text-sm text-neutral-500">Poll not found.</p>;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <button
        onClick={() => navigate(-1)}
        className="flex w-fit items-center gap-1.5 text-sm text-neutral-500 hover:text-white"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <PollCard poll={poll} onChange={setPoll} />

      <div className="rounded-2xl border border-neutral-900 bg-neutral-950 p-5">
        <p className="mb-4 font-semibold text-white">Comments ({comments.length})</p>

        <form onSubmit={submitComment} className="mb-5 flex items-center gap-2">
          <Avatar src={user?.avatar} name={user?.name} size={32} />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-600 outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={posting}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-black transition hover:bg-emerald-400 disabled:opacity-50"
          >
            <Send size={15} />
          </button>
        </form>

        <div className="flex flex-col gap-4">
          {comments.length === 0 ? (
            <p className="text-sm text-neutral-600">No comments yet. Start the conversation.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex items-start gap-2.5">
                <Avatar src={c.user?.avatar} name={c.user?.name} size={32} />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold text-white">{c.user?.name}</span>{" "}
                    <span className="text-neutral-500">· {timeAgo(c.createdAt)}</span>
                  </p>
                  <p className="text-sm text-neutral-300">{c.text}</p>
                </div>
                {c.userId === user?.id && (
                  <button onClick={() => removeComment(c.id)} className="text-neutral-600 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
