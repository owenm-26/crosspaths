import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import useAuth from "./hooks/AuthContext"

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

  
</View>

  );
}

