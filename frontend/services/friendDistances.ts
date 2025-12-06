import { User } from "@/types/login";
import api from "./api";
import { FriendDistance } from "@/types/home";
import { AxiosRequestConfig } from "axios";

export const getFriendDistances = async (
  user_phone: string
): Promise<FriendDistance[] | null> => {
  const res = await api.get<FriendDistance[]>("/friend_distances", {
    params: { user_phone },   
  });

  return res.data ?? null;
};
