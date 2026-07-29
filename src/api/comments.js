import client from "./client";

export const getComments = (pollId) => client.get(`/polls/${pollId}/comments`);

export const addComment = (pollId, text, parent = null) =>
  client.post(`/polls/${pollId}/comments`, { text, parent });

export const deleteComment = (commentId) => client.delete(`/comments/${commentId}`);
