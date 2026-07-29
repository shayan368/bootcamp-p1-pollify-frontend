import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import CreatePollPage from "./pages/CreatePollPage";
import MyPollsPage from "./pages/MyPollsPage";
import VotedPollsPage from "./pages/VotedPollsPage";
import BookmarkedPollsPage from "./pages/BookmarkedPollsPage";
import SettingsPage from "./pages/SettingsPage";
import UserProfilePage from "./pages/UserProfilePage";
import PollDetailPage from "./pages/PollDetailPage";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/create-poll" element={<CreatePollPage />} />
          <Route path="/my-polls" element={<MyPollsPage />} />
          <Route path="/voted-polls" element={<VotedPollsPage />} />
          <Route path="/bookmarked-polls" element={<BookmarkedPollsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/user/:username" element={<UserProfilePage />} />
          <Route path="/poll/:id" element={<PollDetailPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
