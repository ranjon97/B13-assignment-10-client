import { api } from "./axiosInstance";

export const authApi = {
  register: (payload) => api.post("/auth/register", payload).then((r) => r.data.data),
  login: (payload) => api.post("/auth/login", payload).then((r) => r.data.data),
  googleLogin: (idToken) => api.post("/auth/google", { idToken }).then((r) => r.data.data),
  logout: () => api.post("/auth/logout").then((r) => r.data),
  getCurrentUser: () => api.get("/auth/me").then((r) => r.data.data),
};
