import client from "./client";

export const getPolls = (params = {}) => client.get("/polls", { params });

export const getPollById = (id) => client.get(`/polls/${id}`);

export const createPoll = (formData) => client.post("/polls", formData);

export const votePoll = (id, value) => client.post(`/polls/${id}/vote`, { value });

export const closePoll = (id) => client.put(`/polls/${id}/close`);

export const deletePoll = (id) => client.delete(`/polls/${id}`);

export const getMyVotedPolls = () => client.get("/polls/mine/voted");

export const getPollTypeCounts = () => client.get("/polls/types/counts");
