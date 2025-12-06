export interface LoginPayload{
    phone: string
    password: string
}

export interface User {
  created_at: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  home_location: string;
  curr_location: string;
  city: string;
  notif_enabled: number;
}

export interface Friend {
  user_phone: string;
  friend_phone: string;
}

export interface FriendRequest {
  from_phone: string;
  to_phone: string;
  accepted: number;
}

export interface Inbox {
  notification: number;
  from_phone: string;
  to_phone: string;
}

export interface Location {
  id: number;
  zipcode: string;
  city: string;
  state: string;
}
