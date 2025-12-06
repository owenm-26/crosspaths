import api from "./api";
import {LoginPayload, User} from '../types/login'
import { UserInfo } from "@/app/hooks/AuthContext";
import * as SecureStore from "expo-secure-store";

export const registerUser = async (data: any):Promise<UserInfo | null> => {
  const res:any = await api.post("/users", data)
  const user: UserInfo = {first_name: res.data.user.first_name, 
                          last_name: res.data.user.last_name, 
                          phone_number: res.data.user.phone_number, 
                          token: res.data.token,
                        }
  await SecureStore.setItemAsync("token", user.token);
  return user;
};

export const loginUser = async (data: LoginPayload):Promise<UserInfo | null> =>  {
  const res: any = await api.post("/login", data);
  if(res){
    const user: UserInfo = {first_name: res.data.user.first_name, 
                              last_name: res.data.user.last_name, 
                              token: res.data.token,
                              phone_number: res.data.user.phone_number
                              }
      await SecureStore.setItemAsync("token", user.token);
      return user;
  }
  return null;
  
};