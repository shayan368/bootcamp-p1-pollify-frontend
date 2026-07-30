import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, MessageCircle, BarChart3 } from "lucide-react";
import Avatar from "./Avatar";
import * as notificationsApi from "../api/notifications";

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const { data } = await notificationsApi.getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      // fail silently - the bell just won't show a badge
    }
  }, []);

  // poll for new notifications every 30s so the badge stays fresh without a refresh
  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  // close the dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleOpen = async () => {
    const next = !open;
    setOpen(next);
    if (next && unreadCount > 0) {
      setLoading(true);
      try {
        await notificationsApi.markAllNotificationsRead();
        setUnreadCount(0);
      } catch {
        // ignore - badge will correct itself on next poll
      } finally {
        setLoading(false);
      }
    }
  };

  const goToPoll = (pollId) => {
    setOpen(false);
    navigate(`/poll/${pollId}`);
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={toggleOpen}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-neutral-800 text-neutral-400 transition hover:text-white"
      >
        <Bell size={17} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-black">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-40 w-80 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-xl">
          <div className="border-b border-neutral-900 px-4 py-3">
            <p className="text-sm font-semibold text-white">Notifications</p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-neutral-500">
                {loading ? "Loading..." : "No notifications yet."}
              </p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => goToPoll(n.poll?.id)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-neutral-900 ${
                    !n.read ? "bg-emerald-500/5" : ""
                  }`}
                >
                  <Avatar src={n.actor?.avatar} name={n.actor?.name} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-neutral-200">
                      <span className="font-semibold text-white">{n.actor?.name}</span>{" "}
                      {n.type === "vote" ? "voted on your poll" : "commented on your poll"}
                    </p>
                    <p className="truncate text-xs text-neutral-500">{n.poll?.question}</p>
                    <p className="mt-0.5 text-xs text-neutral-600">{timeAgo(n.createdAt)}</p>
                  </div>
                  <span className="mt-1 shrink-0 text-neutral-600">
                    {n.type === "vote" ? <BarChart3 size={14} /> : <MessageCircle size={14} />}
                  </span>
                  {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
