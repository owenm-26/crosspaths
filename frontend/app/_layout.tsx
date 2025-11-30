import { Stack } from "expo-router";
import { useEffect } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { LOCATION_TASK } from "../tasks/location-task";
import { Platform } from "react-native";


export default function RootLayout() {
  useEffect(() => {
    (async () => {
      // Request foreground permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      // Request background permission
      const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
      if (bgStatus !== "granted") return;

      if (Platform.OS == "web") {console.log("Location Doesn't Work on Web"); return;}
      // Check if the background task is already registered
      const tasks = await TaskManager.getRegisteredTasksAsync();
      const isTaskStarted = tasks.some(task => task.taskName === LOCATION_TASK);

      if (!isTaskStarted) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK, {
          accuracy: Location.Accuracy.Lowest,
          timeInterval: 15 * 60 * 1000, // 15 minutes
          deferredUpdatesInterval: 15 * 60 * 1000,
          showsBackgroundLocationIndicator: false,
        });
      }
    })();
  }, []);

  return <Stack />;
}
