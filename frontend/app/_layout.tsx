import { Stack } from "expo-router";
import { useEffect } from "react";
import api from "../services/api"

export default function RootLayout() {
  useEffect(() => {
    console.log('🔥 Layout mounted - API should be initialized');
    console.log('🔥 API baseURL:', api.defaults.baseURL);
  }, []);
  return <Stack />;
}
