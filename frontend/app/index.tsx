import { Redirect } from "expo-router";

// immediately redirect to login page so that the first
// screen always start from login/registration
export default function Index() {
  return <Redirect href="/login" />;
}
