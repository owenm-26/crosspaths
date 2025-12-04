import { Redirect, Stack } from "expo-router";
import useAuth  from "../hooks/useAuth";

export default function TabsLayout() {
  const { user } = useAuth();

  // If NOT logged in → redirect to login
  if (!user) {
    return <Redirect href="/login" />;
  }

  // If logged in → show the tabs
  return <Stack screenOptions={{ headerShown: false }} />;
}
