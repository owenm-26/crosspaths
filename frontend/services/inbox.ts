import { FriendRequest } from "@/types/inbox";
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

  let output: FriendRequest[] = [];
  res.data.map((item: any) =>
    output.push({
      from_phone: item.from_phone,
      first_name: item.first_name,
      last_name: item.last_name,
      timestamp: item.timestamp
    })
  );

  return output;
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
