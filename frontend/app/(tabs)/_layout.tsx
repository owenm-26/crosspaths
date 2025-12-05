import { Tabs, useRouter } from "expo-router";
import useAuth from "../hooks/AuthContext";
import { TouchableOpacity, Text } from "react-native";
import { useEffect } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { LOCATION_TASK } from "@/tasks/location-task";
import { Platform, Alert } from "react-native";
import {checkTasks} from  "@/tasks/utility"

export default function TabsLayout() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    setUser(null);
  };

  useEffect(() => {
    (async () => {
      const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
      if (fgStatus !== "granted") {
        Alert.alert("Permission required", "Allow foreground location");
        return;
      }

      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
      if (bgStatus !== "granted") {
        Alert.alert("Permission required", "Allow background location");
        return;
      }

      if (Platform.OS === "web") return;

      const tasks = await TaskManager.getRegisteredTasksAsync();
      const isStarted = tasks.some(t => t.taskName === LOCATION_TASK);

      if (!isStarted) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK, {
          accuracy: Location.Accuracy.Lowest,
          timeInterval: 15 * 60 * 1000, // 15 min
          deferredUpdatesInterval: 15 * 60 * 1000,
          pausesUpdatesAutomatically: false,
          showsBackgroundLocationIndicator: false,
        });
      }
    })();
    // checkTasks();
  }, []);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user]);

  if (!user) {
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
