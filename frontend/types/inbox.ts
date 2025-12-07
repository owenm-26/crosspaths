export interface FriendRequest {
  from_phone: string; 
  first_name: string; 
  last_name: string; 
  timestamp: string
}

export interface Notification {
  notification: number; // The numeric code from your Inbox.notification
  from_phone: string; // Who sent the notification
  to_phone: string; // Who receives it
  timestamp: string
}
