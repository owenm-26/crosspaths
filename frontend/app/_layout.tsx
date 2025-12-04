import { Stack } from "expo-router";
import { useEffect } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { LOCATION_TASK } from "../tasks/location-task";
import { Platform, Alert } from "react-native";
import {checkTasks} from  "../tasks/utility"
import { AuthProvider } from "./hooks/AuthContext";

export default function RootLayout() {

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

  return  (<AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>);
}