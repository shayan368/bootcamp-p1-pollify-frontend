import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import AuthShell from "../components/AuthShell";
import AuthInput from "../components/AuthInput";
import OtpStep from "../components/OtpStep";
import { useAuth } from "../context/AuthContext";
import * as authApi from "../api/auth";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        username: form.username.trim(),
        password: form.password,
      };
      await authApi.register(payload);
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerified = (token, user) => {
    login(token, user);
    navigate("/dashboard");
  };

  if (step === "otp") {
    return (
      <AuthShell>
        <OtpStep email={form.email} onVerified={handleVerified} />
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <form onSubmit={submit} className="flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Create account</h1>
          <p className="mt-1 text-sm text-neutral-400">Join thousands of people shaping opinions.</p>
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <label className="flex cursor-pointer items-center gap-3">
          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-neutral-800">
              {avatarPreview ? (
                <img src={avatarPreview} alt="" className="h-full w-full object-cover" />
              ) : (
                <Camera size={20} className="text-neutral-500" />
              )}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-black">
              <Camera size={11} />
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Profile photo</p>
            <p className="text-xs text-neutral-500">Optional · PNG or JPG</p>
          </div>
          <input type="file" accept="image/png,image/jpeg" onChange={handleAvatar} className="hidden" />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <AuthInput
            label="Full name"
            placeholder="John Doe"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <AuthInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <AuthInput
          label="Username"
          placeholder="username"
          required
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value.replace(/\s+/g, "").toLowerCase() })}
        />

        <AuthInput
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create account →"}
        </button>

        <p className="text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-emerald-400 hover:underline">
            Sign in
          </Link>
        </p>
        <p className="text-center text-xs text-neutral-600">
          By creating an account, you agree to our Terms of Service.
        </p>
      </form>
    </AuthShell>
  );
}
