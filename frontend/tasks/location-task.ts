import * as TaskManager from "expo-task-manager";
import axios from "axios";

export const LOCATION_TASK = "background-location-task";

interface LocationTaskData {
  locations: {
    coords: {
      latitude: number;
      longitude: number;
    };
  }[];
}

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
  if (error) return;

  const { locations } = data as LocationTaskData;
  const { latitude, longitude } = locations[0].coords;

  // Make coarse location
  const lat = Math.round(latitude * 10) / 10;
  const lon = Math.round(longitude * 10) / 10;

  // Send to backend
  await axios.post("/api/location/update", { lat, lon });
});
