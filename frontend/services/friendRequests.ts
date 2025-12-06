import { FriendRequest } from "@/types/inbox";
import api from "./api";
import * as SecureStore from "expo-secure-store";

export const acceptFriend = async (user_phone:string, data:FriendRequest) =>{
    if(!user_phone || !data || !data.from_phone) throw new Error("Null parameter provided")
    const token = await SecureStore.getItemAsync("token");
    if (!token) throw new Error("No auth token found");
    const res = api.post(`/friends`, {"user_phone": user_phone, "friend_phone": data.from_phone })

    return res
}

export const rejectFriend = async (data: any) =>{
    const token = await SecureStore.getItemAsync("token");
    if (!token) throw new Error("No auth token found");
    const res = api.delete()
}