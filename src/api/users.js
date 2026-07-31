import client from "./client";

export const getMe = () => client.get("/users/me");

export const getUserByUsername = (username) => client.get(`/users/${username}`);

export const updateProfile = (formData) => client.put("/users/profile", formData);

export const changePassword = (currentPassword, newPassword) =>
  client.put("/users/change-password", { currentPassword, newPassword });

export const requestDeleteAccount = () => client.post("/users/request-delete-account");

export const deleteAccount = (otp) => client.delete("/users/me", { data: { otp } });

export const followUser = (userId) => client.put(`/users/${userId}/follow`);

export const toggleBookmark = (pollId) => client.put(`/users/bookmarks/${pollId}`);

export const getMyBookmarks = () => client.get("/users/me/bookmarks");
