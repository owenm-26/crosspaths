import api from "./api";

export const sendFriendRequest = async (user_phone_number: string, subj_phone_number:string) =>{
    if (!user_phone_number || !subj_phone_number) return null
    const res = await api.post("/friend_requests", {
      "from_phone": user_phone_number,
      "to_phone": subj_phone_number
    });
    
    return res
}

export const deleteFriend = async(user_phone_number: string, subj_phone_number:string) => {
     if (!user_phone_number || !subj_phone_number) return null
    const res:any = await api.delete(`/remove-friend/by-phone/${user_phone_number}/${subj_phone_number}`)

    return res
}