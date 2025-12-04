import { Tabs, useRouter } from "expo-router";
import useAuth from "../hooks/AuthContext";
import { TouchableOpacity, Text } from "react-native";

export default function TabsLayout() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    // Redirect if not logged in
    router.replace("/login");
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerRight: () => (
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: "#EF4444",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
              marginRight: 12,
            }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>Logout</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="addFriends" options={{ title: "Add Friends" }} />
      <Tabs.Screen name="inbox" options={{ title: "Inbox" }} />
    </Tabs>
  );
}
