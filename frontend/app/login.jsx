import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { loginUser } from "@/services/auth";
import useAuth from "./hooks/AuthContext";
import {UserInfo} from "./hooks/AuthContext"

export default function LoginScreen() {
  const {user, setUser} = useAuth();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
  setError("");

  if (!/^\d{10}$/.test(phone)) {
    setError("Phone number must be 10 digits.");
    return;
  }

  try {
    const response = await loginUser({
      phone_number: phone,
      password: password
    });

    console.log("Logged in:", response);
    setUser(response)
    router.replace("/(tabs)/home");
  } 
  catch (err) {
    console.error(err)
    if (err.response?.data?.detail) {
      setError(err.response.data.detail);
    } else {
      setError("Something went wrong. Try again.");
    }
  }
};


  return (
  <View
    style={{
      flex: 1,
      backgroundColor: "white",
      justifyContent: "center",
      paddingHorizontal: 32, // px-8
    }}
  >
    <Text
      style={{
        fontSize: 36, // text-4xl
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 40, // mb-10
      }}
    >
      CrossPaths
    </Text>

    <View
      style={{
        backgroundColor: "#F9FAFB", // bg-gray-50
        paddingHorizontal: 24, // px-6
        paddingVertical: 32, // py-8
        borderRadius: 24, // rounded-2xl
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5, // for Android shadow
      }}
    >
      <Text
        style={{
          fontSize: 24, // text-2xl
          fontWeight: "600", // font-semibold
          marginBottom: 24, // mb-6
          textAlign: "center",
        }}
      >
        Login
      </Text>

      {/* Phone */}
      <TextInput
        placeholder="Phone Number (10 digits)"
        keyboardType="number-pad"
        value={phone}
        onChangeText={setPhone}
        style={{
          borderWidth: 1,
          borderColor: "#D1D5DB", // border-gray-300
          backgroundColor: "white",
          padding: 16, // p-4
          borderRadius: 20, // rounded-xl
          marginBottom: 8, // mb-2
        }}
      />

      {/* Password */}
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          borderColor: "#D1D5DB",
          backgroundColor: "white",
          padding: 16,
          borderRadius: 20,
          marginBottom: 8,
        }}
      />

      {/* Error Message */}
      {error !== "" && (
        <Text
          style={{
            color: "#EF4444", // text-red-500
            textAlign: "center",
            marginBottom: 16, // mb-4
          }}
        >
          {error}
        </Text>
      )}

      {/* Login button */}
      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: "#2563EB", // bg-blue-600
          paddingVertical: 12, // py-3
          borderRadius: 20,
          marginTop: 12, // mt-3
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontSize: 18, // text-lg
            fontWeight: "600",
          }}
        >
          Log In
        </Text>
      </TouchableOpacity>

      {/* Nav to register */}
      <TouchableOpacity
        onPress={() => router.push("/register")}
        style={{ marginTop: 24 }} // mt-6
      >
        <Text
          style={{
            textAlign: "center",
            color: "#2563EB", // text-blue-600
            fontWeight: "500", // font-medium
          }}
        >
          Don’t have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);
}