import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail } from "lucide-react";
import AuthShell from "../components/AuthShell";
import AuthInput from "../components/AuthInput";
import OtpStep from "../components/OtpStep";
import { useAuth } from "../context/AuthContext";
import * as authApi from "../api/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authApi.login(email, password);
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.data?.needsVerification) {
        setNeedsVerification(true);
      } else {
        setError(err.response?.data?.message || "Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerified = (token, user) => {
    login(token, user);
    navigate("/dashboard");
  };

  if (needsVerification) {
    return (
      <AuthShell>
        <OtpStep email={email} onVerified={handleVerified} />
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <form onSubmit={submit} className="flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-neutral-400">Sign in to your Pollify account.</p>
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Email address
          </span>
          <div className="flex items-center gap-2 rounded-lg bg-neutral-100 px-4 py-2.5">
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-sm text-black placeholder-neutral-500 outline-none"
            />
            <Mail size={16} className="text-neutral-400" />
          </div>
        </label>

        <label className="block">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Password</span>
            <button type="button" className="text-xs font-medium text-emerald-400 hover:underline">
              Forgot password?
            </button>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-neutral-100 px-4 py-2.5">
            <input
              type={showPw ? "text" : "password"}
              required
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-sm text-black placeholder-neutral-500 outline-none"
            />
            <button type="button" onClick={() => setShowPw((s) => !s)} className="text-neutral-400">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in →"}
        </button>

        <div className="flex items-center gap-3 text-xs text-neutral-600">
          <span className="h-px flex-1 bg-neutral-800" />
          New to Pollify?
          <span className="h-px flex-1 bg-neutral-800" />
        </div>

        <Link
          to="/signup"
          className="w-full rounded-lg border border-neutral-800 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-neutral-900"
        >
          Create a free account
        </Link>
      </form>
    </AuthShell>
  );
}
