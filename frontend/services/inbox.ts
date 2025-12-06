import api from "./api";
import * as SecureStore from "expo-secure-store";

export const getPendingFriendRequests = async () => {
  const token = await SecureStore.getItemAsync("token");
  if (!token) throw new Error("No auth token found");

  const res = await api.get("/friend_requests/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

export const getNotifications = async () => {
  const token = await SecureStore.getItemAsync("token");
  if (!token) throw new Error("No auth token found");

  const res = await api.get("/notifications/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};
