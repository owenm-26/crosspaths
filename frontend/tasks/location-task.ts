import * as TaskManager from "expo-task-manager";
import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
interface LocationTaskData {
  locations: {
    coords: {
      latitude: number;
      longitude: number;
    };
  }[];
}

export const LOCATION_TASK = "background-location-task";

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

  const token = await SecureStore.getItemAsync("token");

  try {
    console.log("Sending API request from location-task")
    await fetch(`${API_URL}/api/location/update`, {
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