import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Lock, CheckCircle2, KeyRound } from "lucide-react";
import AuthShell from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";
import * as authApi from "../api/auth";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const tokenParam = searchParams.get("token") || "";
  const emailParam = searchParams.get("email") || "";

  const [token, setToken] = useState(tokenParam);
  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token.trim()) {
      setError("Password reset token is missing. Please click the link in your email again.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await authApi.resetPassword({
        token: token.trim(),
        email: email.trim(),
        password,
      });

      setSuccess(true);

      // Automatically log the user in with the returned token and user profile
      if (data.token && data.user) {
        login(data.token, data.user);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password. The link may have expired or is invalid."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Create new password</h1>
          <p className="mt-1 text-sm text-neutral-400">
            {email ? (
              <>
                Setting a new password for <span className="font-medium text-white">{email}</span>.
              </>
            ) : (
              "Enter your new password below to secure your Pollify account."
            )}
          </p>
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
            {error}
          </p>
        )}

        {success ? (
          <div className="flex flex-col gap-5">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-300">
              <div className="flex items-center gap-2.5 text-base font-semibold text-emerald-400">
                <CheckCircle2 size={20} />
                <span>Password updated successfully!</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-emerald-200/90">
                Your password has been changed and you have been signed in. Redirecting to your
                dashboard...
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-full rounded-lg bg-emerald-500 py-2.5 text-center text-sm font-semibold text-black transition hover:bg-emerald-400"
            >
              Go to Dashboard now →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* If token wasn't in URL, allow user to input token or code */}
            {!tokenParam && (
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  Reset Token / Code
                </span>
                <div className="flex items-center gap-2 rounded-lg bg-neutral-100 px-4 py-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Paste reset token from email"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full bg-transparent text-sm text-black placeholder-neutral-500 outline-none"
                  />
                  <KeyRound size={16} className="text-neutral-400" />
                </div>
              </label>
            )}

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-400">
                New Password
              </span>
              <div className="flex items-center gap-2 rounded-lg bg-neutral-100 px-4 py-2.5">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-black placeholder-neutral-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Confirm New Password
              </span>
              <div className="flex items-center gap-2 rounded-lg bg-neutral-100 px-4 py-2.5">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-black placeholder-neutral-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading || password.length < 8 || !confirmPassword}
              className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-50"
            >
              {loading ? "Updating password..." : "Reset password & sign in →"}
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
