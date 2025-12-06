import * as TaskManager from "expo-task-manager";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import { Platform, Alert } from "react-native";
import {checkTasks} from  "@/tasks/utility"
import { LocationTaskData } from "@/types/locationTask";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const METERS_IN_A_MILE=1609
const MINIMUM_MOVEMENT_BEFORE_UPDATE = METERS_IN_A_MILE * 10
const MINIMUM_TIME_IN_MS_BEFORE_UPDATE = 15 * 60 * 1000;
export const LOCATION_TASK = "background-location-task";

function distanceInMeters(lat1:number, lon1:number, lat2:number, lon2:number) {
  const toRad = (x:number) => (x * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
let lastSentAt: number = 0;
let lastLat: number | null = null;
let lastLon: number | null = null;

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error(`Error in defining task: ${error}`)
  };

  const { locations } = data as LocationTaskData;
  if (!locations || locations.length === 0) {
    console.log("Locations inputted is of length 0")
    return
  };

  const { latitude, longitude } = locations[0].coords;

  const lat = Math.round(latitude * 10) / 10;
  const lon = Math.round(longitude * 10) / 10;
  const now = Date.now();

  // Time filter (15 minutes)
  const timeOk = now - lastSentAt >= MINIMUM_TIME_IN_MS_BEFORE_UPDATE;

  // Distance filter (100m)
  let distOk = false;
  let dist;
  if (lastLat === null || lastLon === null) {
    distOk = true; // first run
  } else {
    dist = distanceInMeters(lastLat, lastLon, latitude, longitude);
    distOk = dist >= MINIMUM_MOVEMENT_BEFORE_UPDATE;
  }

  

  if (!timeOk || !distOk) {
    // console.log("Not hitting backend with new location -- didn't wait or go far enough")
    return;
  }
  console.log(`(-) Distance Moved: ${dist} meters. Ok? ${distOk}\nTime difference: ${now - lastSentAt}. Ok? ${timeOk}`)
  // Passed filters — send to backend
  lastLat = latitude;
  lastLon = longitude;
  lastSentAt = now;

  const token = await SecureStore.getItemAsync("token");

  try {
    console.log("Sending API request from location-task")
    await fetch(`${API_URL}/location/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lat, lon }),
    });
  } catch (err) {
    console.log("Background task network error:", err);
  }

  console.log("Updated User Location")
});

export async function requestLocationPermissions() {
  const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
  if (fgStatus !== "granted") {
    Alert.alert("Permission required", "Allow foreground location");
    return false;
  }

  const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
  if (bgStatus !== "granted") {
    Alert.alert("Permission required", "Allow background location");
    return false;
  }

  if (Platform.OS === "web") return;

  const tasks = await TaskManager.getRegisteredTasksAsync();
  const isStarted = tasks.some(t => t.taskName === LOCATION_TASK);

  if (!isStarted) {
    await Location.startLocationUpdatesAsync(LOCATION_TASK, {
      accuracy: Location.Accuracy.Lowest,
      timeInterval: MINIMUM_TIME_IN_MS_BEFORE_UPDATE,              // minimum time between updates (15 min)
      distanceInterval: MINIMUM_MOVEMENT_BEFORE_UPDATE,     
      deferredUpdatesInterval: MINIMUM_TIME_IN_MS_BEFORE_UPDATE,   // batch and deliver infrequently
      deferredUpdatesDistance: MINIMUM_MOVEMENT_BEFORE_UPDATE,
      pausesUpdatesAutomatically: false,
      showsBackgroundLocationIndicator: true,
    });
  }

  console.log("(+) completed running requestLocationPermissions")

  return true;
}