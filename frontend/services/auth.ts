import api from "./api";
import {LoginPayload, User} from '../../types/login'
import { UserInfo } from "@/app/hooks/AuthContext";

export const registerUser = async (data: any) => {
  return api.post("/users", data)
};

export const loginUser = async (data: LoginPayload):Promise<UserInfo | null> =>  {
  const res: any = await api.post("/login", data);
  console.log(`Response: ${res.data.user}`)
  if(res){
    const user: UserInfo = {first_name: res.data.user.first_name, 
                              last_name: res.data.user.last_name, 
                              token: res.data.token,
                              phone_number: res.data.user.phone_number
                              }
      return user;
  }
  return null;
  
};