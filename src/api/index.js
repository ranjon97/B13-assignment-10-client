import { api } from "./axiosInstance";

export const forumApi = {
  getPosts: (params) => api.get("/forum-posts", { params }).then((r) => r.data),
  getLatest: () => api.get("/forum-posts/latest").then((r) => r.data.data),
  getPost: (id) => api.get(`/forum-posts/${id}`).then((r) => r.data.data),
  createPost: (payload) => api.post("/forum-posts", payload).then((r) => r.data.data),
  getMyPosts: () => api.get("/forum-posts/mine").then((r) => r.data.data),
  deleteOwnPost: (id) => api.delete(`/forum-posts/${id}`).then((r) => r.data),
  getAllForModeration: () => api.get("/forum-posts/moderation/all").then((r) => r.data.data),
  adminDeletePost: (id) => api.delete(`/forum-posts/${id}/moderation`).then((r) => r.data),
  castVote: (postId, type) => api.post(`/forum-posts/${postId}/votes`, { type }).then((r) => r.data.data),
  getMyVote: (postId) => api.get(`/forum-posts/${postId}/votes/mine`).then((r) => r.data.data),
  getComments: (postId) => api.get(`/forum-posts/${postId}/comments`).then((r) => r.data.data),
  createComment: (postId, payload) =>
    api.post(`/forum-posts/${postId}/comments`, payload).then((r) => r.data.data),
};

export const commentApi = {
  update: (id, content) => api.patch(`/comments/${id}`, { content }).then((r) => r.data.data),
  remove: (id) => api.delete(`/comments/${id}`).then((r) => r.data),
};

export const trainerApplicationApi = {
  apply: (payload) => api.post("/trainer-applications", payload).then((r) => r.data.data),
  getMine: () => api.get("/trainer-applications/mine").then((r) => r.data.data),
  getPending: () => api.get("/trainer-applications/pending").then((r) => r.data.data),
  review: (id, payload) => api.patch(`/trainer-applications/${id}/review`, payload).then((r) => r.data.data),
};

export const userApi = {
  getUsers: (params) => api.get("/users", { params }).then((r) => r.data),
  block: (id) => api.patch(`/users/${id}/block`).then((r) => r.data.data),
  unblock: (id) => api.patch(`/users/${id}/unblock`).then((r) => r.data.data),
  promote: (id) => api.patch(`/users/${id}/promote`).then((r) => r.data.data),
  getTrainers: () => api.get("/users/trainers").then((r) => r.data.data),
  demote: (id) => api.patch(`/users/${id}/demote`).then((r) => r.data.data),
  getAdminOverview: () => api.get("/users/stats/admin-overview").then((r) => r.data.data),
  getTrainerOverview: () => api.get("/users/stats/trainer-overview").then((r) => r.data.data),
  getUserOverview: () => api.get("/users/stats/user-overview").then((r) => r.data.data),
};

export const transactionApi = {
  getAll: (params) => api.get("/transactions", { params }).then((r) => r.data),
};

export const uploadApi = {
  uploadImage: (base64Image, meta) =>
    api.post("/uploads", { base64Image, ...meta }).then((r) => r.data.data.url),
};
