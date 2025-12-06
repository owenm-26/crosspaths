import api from "./api";
import {User} from '../types/login'
import { UserBasics } from "@/types/user";

export const getUserBasicsById = async (phone_number: string):Promise<UserBasics | null> => {
    if (!phone_number) return null
    const res:any = await api.get(`/user/by-phone/${phone_number}`)
    console.log(`Res: ${res.data.first_name}`)
    const user: UserBasics = {first_name: res.data.first_name, 
                            last_name: res.data.last_name, 
                            phone_number: res.data.phone_number, 
                            }
    return user;
};
