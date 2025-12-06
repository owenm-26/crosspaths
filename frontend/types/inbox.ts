export interface FriendRequest {
  from_phone: string; 
  first_name: string; 
  last_name: string; 
}

export interface Notification {
  notification_code: number; // The numeric code from your Inbox.notification
  from_phone: string; // Who sent the notification
  to_phone: string; // Who receives it
  message: string; // Human-readable message for the UI
  time: string; // Timestamp as ISO string or formatted string
  from_name: string; // Convenience field for displaying sender
}
