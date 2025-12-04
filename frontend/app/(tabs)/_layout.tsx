import { Redirect, Tabs } from "expo-router";
import useAuth  from "../hooks/AuthContext";

export default function TabsLayout() {
  const { user } = useAuth();

  // If NOT logged in → redirect to login
  if (!user) {
    console.log(`Not logged in, redirecting. + ${user}`)
    return <Redirect href="/login" />;
  }

  // If logged in → show the tabs
  return <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="addFriends" options={{ title: "Add New Friends" }} />
      <Tabs.Screen name="inbox" options={{ title: "Inbox" }} />
    </Tabs>;
}
