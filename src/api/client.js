import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// attach the saved token to every request, if we have one
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("pollify_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// if the token is invalid/expired, clear it and bounce to login
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("pollify_token");
      localStorage.removeItem("pollify_user");
      const path = window.location.pathname;
      if (
        !path.startsWith("/login") &&
        !path.startsWith("/signup") &&
        !path.startsWith("/forgot-password") &&
        !path.startsWith("/reset-password")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default client;
