import { api } from "./axiosInstance";

export const classApi = {
  getClasses: (params) => api.get("/classes", { params }).then((r) => r.data),
  getFeatured: () => api.get("/classes/featured").then((r) => r.data.data),
  getClass: (id) => api.get(`/classes/${id}`).then((r) => r.data.data),
  createClass: (payload) => api.post("/classes", payload).then((r) => r.data.data),
  updateClass: (id, payload) => api.patch(`/classes/${id}`, payload).then((r) => r.data.data),
  deleteClass: (id) => api.delete(`/classes/${id}`).then((r) => r.data),
  getMyClasses: () => api.get("/classes/trainer/mine").then((r) => r.data.data),
  getAttendees: (id) => api.get(`/classes/${id}/attendees`).then((r) => r.data.data),
  getAllForAdmin: (params) => api.get("/classes/admin/all", { params }).then((r) => r.data),
  moderateClass: (id, payload) => api.patch(`/classes/${id}/moderate`, payload).then((r) => r.data.data),
  adminDeleteClass: (id) => api.delete(`/classes/${id}/admin`).then((r) => r.data),
};
