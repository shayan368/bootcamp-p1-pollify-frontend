import client from "./client";

export const register = (formData) => client.post("/auth/register", formData);

export const verifyOtp = (email, otp) => client.post("/auth/verify-otp", { email, otp });

export const resendOtp = (email) => client.post("/auth/resend-otp", { email });

export const login = (email, password) => client.post("/auth/login", { email, password });
