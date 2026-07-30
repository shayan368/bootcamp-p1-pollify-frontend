import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Bookmark, BarChart3, Star, Lock, Check } from "lucide-react";
import Avatar from "./Avatar";
import { useAuth } from "../context/AuthContext";
import * as pollsApi from "../api/polls";
import * as usersApi from "../api/users";

const CATEGORY_COLORS = {
  General: "bg-neutral-800 text-neutral-300",
  Tech: "bg-blue-500/15 text-blue-400",
  Sports: "bg-amber-500/15 text-amber-400",
  Entertainment: "bg-pink-500/15 text-pink-400",
  Lifestyle: "bg-emerald-500/15 text-emerald-400",
  Other: "bg-neutral-800 text-neutral-300",
};

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function PollCard({ poll, onChange, onBookmarkToggle }) {
  const { user, bookmarkedIds, toggleBookmarkLocal } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [localPoll, setLocalPoll] = useState(poll);
  const [openText, setOpenText] = useState("");
  const [selected, setSelected] = useState(null); // chosen option position, before submitting

  const isBookmarked = bookmarkedIds.has(localPoll.id);
  const myVote = localPoll.votes?.find((v) => v.userId === user?.id);
  const hasVoted = Boolean(myVote);
  const totalVotes = localPoll.votes?.length || 0;
  const isOwner = localPoll.creatorId === user?.id;

  const applyUpdatedPoll = (updated) => setLocalPoll(updated);

  const castVote = async (value) => {
    if (busy || localPoll.closed) return;
    setBusy(true);
    try {
      const { data } = await pollsApi.votePoll(localPoll.id, value);
      applyUpdatedPoll(data.poll);
      onChange?.(data.poll);
    } catch (err) {
      alert(err.response?.data?.message || "Couldn't submit your vote");
    } finally {
      setBusy(false);
    }
  };

  const submitOpenAnswer = (e) => {
    e.preventDefault();
    if (!openText.trim()) return;
    castVote(openText.trim());
    setOpenText("");
  };

  const handleBookmark = async () => {
    try {
      const { data } = await usersApi.toggleBookmark(localPoll.id);
      toggleBookmarkLocal(localPoll.id, data.bookmarked);
      onBookmarkToggle?.(localPoll.id, data.bookmarked);
    } catch (err) {
      alert(err.response?.data?.message || "Couldn't update bookmark");
    }
  };

  const optionVoteCount = (position) =>
    localPoll.votes?.filter((v) => Number(v.value) === position).length || 0;

  const categoryClass = CATEGORY_COLORS[localPoll.category] || CATEGORY_COLORS.Other;
  const showResults = hasVoted || localPoll.closed;

  return (
    <div className="rounded-2xl border border-neutral-900 bg-neutral-950 p-5">
      {/* header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <button
          onClick={() => navigate(`/user/${localPoll.creator?.username}`)}
          className="flex items-center gap-2.5 text-left"
        >
          <Avatar src={localPoll.creator?.avatar} name={localPoll.creator?.name} size={36} />
          <div>
            <p className="text-sm font-semibold text-white">{localPoll.creator?.name}</p>
            <p className="text-xs text-neutral-500">
              @{localPoll.creator?.username} · {timeAgo(localPoll.createdAt)}
            </p>
          </div>
        </button>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${categoryClass}`}>
          {localPoll.category}
        </span>
      </div>

      {/* question */}
      <button className="mb-4 block text-left" onClick={() => navigate(`/poll/${localPoll.id}`)}>
        <p className="text-base font-bold text-white">{localPoll.question}</p>
      </button>

      {/* body - varies by type */}
      {localPoll.type === "image" ? (
        <ImageChoiceBlock
          poll={localPoll}
          myVote={myVote}
          showResults={showResults}
          totalVotes={totalVotes}
          optionVoteCount={optionVoteCount}
          selected={selected}
          setSelected={setSelected}
          onSubmit={() => castVote(selected)}
          busy={busy}
          disabled={!user}
        />
      ) : (
        ["single", "yesno"].includes(localPoll.type) && (
          <ChoiceListBlock
            poll={localPoll}
            myVote={myVote}
            showResults={showResults}
            totalVotes={totalVotes}
            optionVoteCount={optionVoteCount}
            selected={selected}
            setSelected={setSelected}
            onSubmit={() => castVote(selected)}
            busy={busy}
            disabled={!user}
          />
        )
      )}

      {localPoll.type === "rating" && (
        <RatingBlock
          poll={localPoll}
          myVote={myVote}
          showResults={showResults}
          totalVotes={totalVotes}
          onRate={castVote}
          disabled={busy || !user}
        />
      )}

      {localPoll.type === "open" && (
        <div>
          {hasVoted ? (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2.5 text-sm text-emerald-300">
              Your answer: “{myVote.value}”
            </div>
          ) : localPoll.closed ? (
            <p className="text-sm text-neutral-500">This poll is closed.</p>
          ) : (
            <form onSubmit={submitOpenAnswer} className="flex gap-2">
              <input
                value={openText}
                onChange={(e) => setOpenText(e.target.value)}
                placeholder="Type your answer..."
                className="flex-1 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-600 outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={busy}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-60"
              >
                Send
              </button>
            </form>
          )}
          <p className="mt-2 text-xs text-neutral-600">{totalVotes} response{totalVotes === 1 ? "" : "s"}</p>
        </div>
      )}

      {localPoll.closed && (
        <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-neutral-500">
          <Lock size={12} /> This poll is closed
        </p>
      )}

      {/* footer */}
      <div className="mt-4 flex items-center gap-5 border-t border-neutral-900 pt-3 text-sm text-neutral-500">
        <span className="flex items-center gap-1.5">
          <BarChart3 size={16} /> {totalVotes}
        </span>
        <button
          onClick={() => navigate(`/poll/${localPoll.id}`)}
          className="flex items-center gap-1.5 transition hover:text-white"
        >
          <MessageCircle size={16} /> Comments
        </button>
        <button
          onClick={handleBookmark}
          className={`ml-auto flex items-center gap-1.5 transition hover:text-white ${
            isBookmarked ? "text-emerald-400" : ""
          }`}
        >
          <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
        </button>
        {isOwner && !localPoll.closed && (
          <button
            onClick={async () => {
              const { data } = await pollsApi.closePoll(localPoll.id);
              applyUpdatedPoll(data.poll);
              onChange?.(data.poll);
            }}
            className="text-xs font-medium text-neutral-500 transition hover:text-white"
          >
            Close poll
          </button>
        )}
      </div>
    </div>
  );
}

function ChoiceListBlock({ poll, myVote, showResults, totalVotes, optionVoteCount, selected, setSelected, onSubmit, busy, disabled }) {
  return (
    <div>
      <div className="flex flex-col gap-2">
        {poll.options?.map((opt, i) => {
          const position = opt.position ?? i;
          const count = optionVoteCount(position);
          const pct = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
          const isMine = myVote && Number(myVote.value) === position;
          const isSelected = selected === position;
          const letter = String.fromCharCode(65 + i);

          if (showResults) {
            return (
              <div key={opt.id ?? i} className="relative overflow-hidden rounded-lg border border-neutral-800 px-3 py-2.5">
                <div
                  className={`absolute inset-y-0 left-0 ${isMine ? "bg-emerald-500/20" : "bg-neutral-800/60"}`}
                  style={{ width: `${pct}%` }}
                />
                <div className="relative flex items-center justify-between text-sm">
                  <span className={`flex items-center gap-2 ${isMine ? "text-emerald-400 font-semibold" : "text-neutral-200"}`}>
                    {opt.text}
                  </span>
                  <span className="text-neutral-400">{pct}%</span>
                </div>
              </div>
            );
          }

          return (
            <button
              key={opt.id ?? i}
              disabled={disabled}
              onClick={() => setSelected(position)}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition disabled:opacity-60 ${
                isSelected
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                  : "border-neutral-800 text-neutral-200 hover:border-emerald-500/50 hover:bg-emerald-500/5"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                  isSelected ? "border-emerald-500 bg-emerald-500 text-black" : "border-neutral-700 text-neutral-400"
                }`}
              >
                {isSelected ? <Check size={13} /> : letter}
              </span>
              {opt.text}
            </button>
          );
        })}
      </div>

      {!showResults && (
        <button
          onClick={onSubmit}
          disabled={selected === null || busy || disabled}
          className="mt-3 w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-bold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? "Submitting..." : "Submit vote"}
        </button>
      )}
    </div>
  );
}

function ImageChoiceBlock({ poll, myVote, showResults, totalVotes, optionVoteCount, selected, setSelected, onSubmit, busy, disabled }) {
  const options = poll.options || [];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => {
          const position = opt.position ?? i;
          const count = optionVoteCount(position);
          const pct = totalVotes ? Math.round((count / totalVotes) * 100) : 0;
          const isMine = myVote && Number(myVote.value) === position;
          const isSelected = selected === position;
          // odd option out (e.g. 3rd of 3) spans the full row, matching a masonry-ish layout
          const isLastOdd = options.length % 2 === 1 && i === options.length - 1;

          return (
            <button
              key={opt.id ?? i}
              disabled={disabled || showResults}
              onClick={() => !showResults && setSelected(position)}
              className={`relative aspect-video overflow-hidden rounded-xl border-2 transition ${
                isSelected || isMine ? "border-emerald-500" : "border-neutral-800 hover:border-neutral-700"
              } ${isLastOdd ? "col-span-2" : ""} disabled:cursor-default`}
            >
              {opt.image ? (
                <img src={opt.image} alt={opt.text || ""} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-xs text-neutral-600">
                  No image
                </div>
              )}

              {/* bottom gradient + label */}
              {opt.text && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                  <span className="text-sm font-semibold text-white drop-shadow">{opt.text}</span>
                </div>
              )}

              {(isSelected || isMine) && (
                <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-black shadow">
                  <Check size={14} strokeWidth={3} />
                </span>
              )}

              {showResults && (
                <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-black/60 px-2.5 py-1.5 text-xs font-semibold text-white">
                  <span>{pct}%</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {!showResults && (
        <button
          onClick={onSubmit}
          disabled={selected === null || busy || disabled}
          className="mt-3 w-full rounded-lg border border-emerald-500 py-2.5 text-sm font-bold text-emerald-400 transition hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? "Submitting..." : "Submit vote"}
        </button>
      )}
    </div>
  );
}

function RatingBlock({ poll, myVote, showResults, totalVotes, onRate, disabled }) {
  const avg =
    totalVotes && poll.votes ? poll.votes.reduce((sum, v) => sum + Number(v.value), 0) / totalVotes : 0;

  if (showResults) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              size={20}
              className={n <= Math.round(avg) ? "text-amber-400" : "text-neutral-700"}
              fill={n <= Math.round(avg) ? "currentColor" : "none"}
            />
          ))}
        </div>
        <span className="text-sm text-neutral-400">
          {avg.toFixed(1)} avg · {totalVotes} rating{totalVotes === 1 ? "" : "s"}
          {myVote && <span className="text-emerald-400"> · you rated {myVote.value}</span>}
        </span>
      </div>
    );
  }

  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          disabled={disabled}
          onClick={() => onRate(n)}
          className="rounded-md p-1 text-neutral-600 transition hover:text-amber-400 disabled:opacity-60"
        >
          <Star size={24} />
        </button>
      ))}
    </div>
  );
}
