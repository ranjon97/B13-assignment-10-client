import { api } from "./axiosInstance";

export const bookingApi = {
  getStatus: (classId) => api.get(`/bookings/status/${classId}`).then((r) => r.data.data),
  createCheckoutSession: (classId) =>
    api.post("/bookings/checkout-session", { classId }).then((r) => r.data.data),
  confirmBooking: (sessionId) => api.post("/bookings/confirm", { sessionId }).then((r) => r.data.data),
  getMyBookings: () => api.get("/bookings/mine").then((r) => r.data.data),
};

export const favoriteApi = {
  getStatus: (classId) => api.get(`/favorites/status/${classId}`).then((r) => r.data.data),
  add: (classId) => api.post(`/favorites/${classId}`).then((r) => r.data.data),
  remove: (classId) => api.delete(`/favorites/${classId}`).then((r) => r.data),
  getMine: () => api.get("/favorites/mine").then((r) => r.data.data),
};
