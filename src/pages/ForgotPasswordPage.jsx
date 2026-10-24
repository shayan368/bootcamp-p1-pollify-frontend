import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import AuthShell from "../components/AuthShell";
import * as authApi from "../api/auth";

export default function ForgotPasswordPage() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResendMsg("");
    setLoading(true);

    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResending(true);
    try {
      await authApi.forgotPassword(email);
      setResendMsg("A new password reset link has been sent to your email!");
      setTimeout(() => setResendMsg(""), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend reset link");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthShell>
      <div className="flex flex-col gap-6">
        <div>
          <Link
            to="/login"
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 transition hover:text-white"
          >
            <ArrowLeft size={14} /> Back to sign in
          </Link>
          <h1 className="text-2xl font-bold text-white">Forgot password?</h1>
          <p className="mt-1 text-sm text-neutral-400">
            {sent
              ? "We've sent a password reset link to your email."
              : "Enter your registered email address to receive a secure password reset link."}
          </p>
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
            {error}
          </p>
        )}

        {sent ? (
          <div className="flex flex-col gap-5">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              <div className="flex items-center gap-2 font-semibold text-emerald-400">
                <CheckCircle2 size={18} />
                <span>Reset link sent!</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-emerald-200/90">
                A password reset link was sent to <strong className="text-white">{email}</strong>.
                Click the link in your email to open the reset page in a new tab and create your new
                password.
              </p>
            </div>

            {resendMsg && (
              <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                {resendMsg}
              </p>
            )}

            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-center text-sm font-medium text-emerald-400 transition hover:underline disabled:opacity-50"
            >
              {resending ? "Resending link..." : "Didn't receive an email? Send again"}
            </button>

            <Link
              to="/login"
              className="w-full rounded-lg bg-emerald-500 py-2.5 text-center text-sm font-semibold text-black transition hover:bg-emerald-400"
            >
              Return to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                  autoFocus
                />
                <Mail size={16} className="text-neutral-400" />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-50"
            >
              {loading ? "Sending reset link..." : "Send reset link →"}
            </button>

            <p className="text-center text-xs text-neutral-500">
              Remember your password?{" "}
              <Link to="/login" className="font-medium text-emerald-400 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </AuthShell>
  );
}
