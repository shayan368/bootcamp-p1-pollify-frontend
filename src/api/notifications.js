import client from "./client";

export const getNotifications = () => client.get("/notifications");

export const markAllNotificationsRead = () => client.put("/notifications/read-all");
