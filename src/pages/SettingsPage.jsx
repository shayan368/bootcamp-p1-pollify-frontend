import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Camera, LogOut } from "lucide-react";
import Avatar from "../components/Avatar";
import { useAuth } from "../context/AuthContext";
import * as usersApi from "../api/users";

export default function SettingsPage() {
  const { user, refreshMe, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  const [deleteStep, setDeleteStep] = useState(1);
  const [deleteOtp, setDeleteOtp] = useState("");
  const [deleteMsg, setDeleteMsg] = useState("");
  const [deleteErr, setDeleteErr] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileErr("");
    setSavingProfile(true);
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("username", username);
      fd.append("bio", bio);
      if (avatarFile) fd.append("avatar", avatarFile);
      await usersApi.updateProfile(fd);
      await refreshMe();
      setProfileMsg("Profile saved");
      setTimeout(() => setProfileMsg(""), 3000);
    } catch (err) {
      setProfileErr(err.response?.data?.message || "Couldn't save profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwMsg("");
    setPwErr("");
    setSavingPw(true);
    try {
      await usersApi.changePassword(currentPassword, newPassword);
      setPwMsg("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setPwMsg(""), 3000);
    } catch (err) {
      setPwErr(err.response?.data?.message || "Couldn't update password");
    } finally {
      setSavingPw(false);
    }
  };

  const requestDelete = async () => {
    setDeleteMsg("");
    setDeleteErr("");
    setDeleting(true);
    try {
      await usersApi.requestDeleteAccount();
      setDeleteStep(2);
      setDeleteMsg("OTP sent to your email. Check your inbox.");
    } catch (err) {
      setDeleteErr(err.response?.data?.message || "Failed to request account deletion");
    } finally {
      setDeleting(false);
    }
  };

  const confirmDelete = async (e) => {
    e.preventDefault();
    setDeleteMsg("");
    setDeleteErr("");
    setDeleting(true);
    try {
      await usersApi.deleteAccount(deleteOtp);
      logout();
      navigate("/register");
    } catch (err) {
      setDeleteErr(err.response?.data?.message || "Invalid OTP or failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {/* Profile card */}
      <form onSubmit={saveProfile} className="flex flex-col gap-5 rounded-2xl border border-neutral-900 bg-neutral-950 p-6">
        <p className="font-semibold text-white">Profile</p>

        {profileErr && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">{profileErr}</p>
        )}
        {profileMsg && (
          <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
            {profileMsg}
          </p>
        )}

        <label className="flex cursor-pointer items-center gap-3">
          <div className="relative">
            <Avatar src={avatarPreview || user?.avatar} name={user?.name} size={56} />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-black">
              <Camera size={11} />
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Profile photo</p>
            <p className="text-xs text-neutral-500">PNG or JPG</p>
          </div>
          <input type="file" accept="image/png,image/jpeg" onChange={handleAvatar} className="hidden" />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Full name" value={name} onChange={setName} />
          <Field label="Username" value={username} onChange={setUsername} />
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">Email</span>
          <input
            disabled
            value={user?.email || ""}
            className="w-full cursor-not-allowed rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-2.5 text-sm text-neutral-500"
          />
          <span className="mt-1 block text-xs text-neutral-600">Email cannot be changed</span>
        </label>

        <label className="block">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Bio</span>
            <span className="text-xs text-neutral-600">{bio.length}/160</span>
          </div>
          <textarea
            value={bio}
            maxLength={160}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell the community about yourself..."
            rows={3}
            className="w-full resize-none rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-emerald-500"
          />
        </label>

        <button
          type="submit"
          disabled={savingProfile}
          className="w-fit rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-50"
        >
          {savingProfile ? "Saving..." : "Save profile"}
        </button>
      </form>

      {/* Change password card */}
      <form onSubmit={savePassword} className="flex flex-col gap-4 rounded-2xl border border-neutral-900 bg-neutral-950 p-6">
        <p className="font-semibold text-white">Change password</p>

        {pwErr && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">{pwErr}</p>
        )}
        {pwMsg && (
          <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
            {pwMsg}
          </p>
        )}

        <PasswordField
          label="Current password"
          value={currentPassword}
          onChange={setCurrentPassword}
          show={showCurrent}
          setShow={setShowCurrent}
        />
        <PasswordField
          label="New password"
          value={newPassword}
          onChange={setNewPassword}
          show={showNew}
          setShow={setShowNew}
          minLength={8}
        />

        <button
          type="submit"
          disabled={savingPw}
          className="w-fit rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-50"
        >
          {savingPw ? "Updating..." : "Update password"}
        </button>
      </form>

      {/* Danger Zone */}
      <div className="flex flex-col gap-4 rounded-2xl border border-red-900/30 bg-red-950/10 p-6">
        <p className="font-semibold text-red-500">Danger Zone</p>

        {deleteErr && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">{deleteErr}</p>
        )}
        {deleteMsg && (
          <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
            {deleteMsg}
          </p>
        )}

        {deleteStep === 1 ? (
          <div>
            <p className="mb-4 text-sm text-neutral-400">
              Permanently delete your account and all associated polls, comments, and votes. This action cannot be undone.
            </p>
            <button
              onClick={requestDelete}
              disabled={deleting}
              className="w-fit rounded-lg bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-500/20 disabled:opacity-50"
            >
              {deleting ? "Requesting..." : "Delete account"}
            </button>
          </div>
        ) : (
          <form onSubmit={confirmDelete} className="flex flex-col gap-4">
            <p className="text-sm text-neutral-400">
              An OTP has been sent to your email. Enter it below to confirm deletion.
            </p>
            <Field label="Enter OTP" value={deleteOtp} onChange={setDeleteOtp} />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={deleting || !deleteOtp}
                className="rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Confirm Deletion"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeleteStep(1);
                  setDeleteOtp("");
                  setDeleteErr("");
                  setDeleteMsg("");
                }}
                className="text-sm font-medium text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* the sidebar (with its own log out link) is desktop-only, so mobile users need
          another way to log out - this button only shows up below the md breakpoint */}
      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 md:hidden"
      >
        <LogOut size={16} />
        Log out
      </button>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500"
      />
    </label>
  );
}

function PasswordField({ label, value, onChange, show, setShow, minLength }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</span>
      <div className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5">
        <input
          type={show ? "text" : "password"}
          value={value}
          minLength={minLength}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-white outline-none"
        />
        <button type="button" onClick={() => setShow((s) => !s)} className="text-neutral-500 hover:text-white">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </label>
  );
}
