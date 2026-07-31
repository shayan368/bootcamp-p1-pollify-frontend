import client from "./client";

export const register = (payload) => client.post("/auth/register", payload);

export const verifyOtp = (email, otp) => client.post("/auth/verify-otp", { email, otp });

export const resendOtp = (email) => client.post("/auth/resend-otp", { email });

export const login = (email, password) => client.post("/auth/login", { email, password });
