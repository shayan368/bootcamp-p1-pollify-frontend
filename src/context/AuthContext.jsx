import { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as usersApi from "../api/users";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null); // pollCount / votedCount / bookmarkCount / followingCount / followerCount
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const refreshBookmarks = useCallback(async () => {
    try {
      const { data } = await usersApi.getMyBookmarks();
      setBookmarkedIds(new Set(data.polls.map((p) => p.id)));
    } catch {
      setBookmarkedIds(new Set());
    }
  }, []);

  const refreshMe = useCallback(async () => {
    const token = localStorage.getItem("pollify_token");
    if (!token) {
      setUser(null);
      setStats(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await usersApi.getMe();
      setUser(data.user);
      setStats({
        pollCount: data.pollCount,
        votedCount: data.votedCount,
        bookmarkCount: data.bookmarkCount,
        followingCount: data.followingCount,
        followerCount: data.followerCount,
      });
      localStorage.setItem("pollify_user", JSON.stringify(data.user));
      refreshBookmarks();
    } catch {
      setUser(null);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [refreshBookmarks]);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const login = (token, userData) => {
    localStorage.setItem("pollify_token", token);
    localStorage.setItem("pollify_user", JSON.stringify(userData));
    setUser(userData);
    refreshMe();
  };

  const logout = () => {
    localStorage.removeItem("pollify_token");
    localStorage.removeItem("pollify_user");
    setUser(null);
    setStats(null);
    setBookmarkedIds(new Set());
  };

  // optimistic local toggle - call after a successful API bookmark toggle
  const toggleBookmarkLocal = (pollId, bookmarked) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (bookmarked) next.add(pollId);
      else next.delete(pollId);
      return next;
    });
    setStats((prev) => (prev ? { ...prev, bookmarkCount: prev.bookmarkCount + (bookmarked ? 1 : -1) } : prev));
  };

  return (
    <AuthContext.Provider
      value={{ user, stats, loading, login, logout, refreshMe, bookmarkedIds, toggleBookmarkLocal }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
