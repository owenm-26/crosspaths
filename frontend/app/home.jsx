import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import useAuth from "./hooks/useAuth"

export default function HomeScreen() {
  const router = useRouter();
  const {user, setUser} = useAuth();

  const handleLogout = () => {
    // In mock phase: just navigate back to login
    setUser(null)
    router.replace("/login");
  };

  return (
    <View
  style={{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 24, // px-6
  }}
>
  <Text
    style={{
      fontSize: 30, // text-3xl
      fontWeight: "bold",
      marginBottom: 24, // mb-6
    }}
  >
    Welcome to CrossPaths!
  </Text>

  <Text
    style={{
      color: "#4B5563", // text-gray-600
      fontSize: 18, // text-lg
      textAlign: "center",
      marginBottom: 40, // mb-10
    }}
  >
    This is a placeholder page until Milestone 3.
  </Text>

  <TouchableOpacity
    onPress={handleLogout}
    style={{
      backgroundColor: "#EF4444", // bg-red-500
      paddingHorizontal: 24, // px-6
      paddingVertical: 12, // py-3
      borderRadius: 20, // rounded-xl
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5, // for Android shadow
    }}
  >
    <Text
      style={{
        color: "white",
        fontSize: 18, // text-lg
        fontWeight: "600", // font-semibold
        textAlign: "center",
      }}
    >
      Logout
    </Text>
  </TouchableOpacity>
</View>

  );
}

