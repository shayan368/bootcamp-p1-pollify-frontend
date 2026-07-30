import { useState } from "react";
import * as authApi from "../api/auth";

export default function OtpStep({ email, onVerified }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authApi.verifyOtp(email, otp);
      onVerified(data.token, data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError("");
    try {
      await authApi.resendOtp(email);
      setResent(true);
      setTimeout(() => setResent(false), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't resend the code");
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Verify your email</h1>
        <p className="mt-1 text-sm text-neutral-400">
          We sent a 6-digit code to <span className="text-white">{email}</span>. Enter it below.
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
        placeholder="000000"
        inputMode="numeric"
        className="w-full rounded-lg border border-transparent bg-neutral-100 px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] text-black outline-none focus:border-emerald-500"
      />

      <button
        type="submit"
        disabled={loading || otp.length !== 6}
        className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify code"}
      </button>

      <button type="button" onClick={resend} className="text-sm font-medium text-emerald-400 hover:underline">
        {resent ? "Code sent - check your inbox" : "Didn't get a code? Resend"}
      </button>
    </form>
  );
}
