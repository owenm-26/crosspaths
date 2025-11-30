import * as Notifications from 'expo-notifications';
import api from './api';

async function registerForPushNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  const tokenData = await Notifications.getExpoPushTokenAsync();
  const token = tokenData.data;

  // send token to backend
  await api.post("/api/users/push-token", { token });
}
