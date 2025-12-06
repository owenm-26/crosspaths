import api from "./api";
import {User} from '../types/login'
import { UserBasics } from "@/types/user";

export const getUserBasicsById = async (user_phone_number:string, subj_phone_number: string):Promise<UserBasics | null> => {
    if (!user_phone_number || !subj_phone_number) return null
    const res:any = await api.get(`/user/by-phone/${user_phone_number}/${subj_phone_number}`)
    const user: UserBasics = {first_name: res.data.user.first_name, 
                            last_name: res.data.user.last_name, 
                            phone_number: res.data.user.phone_number, 
                            is_already_friend: res.data.is_already_friend
                            }
    return user;
};
