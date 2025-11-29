import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import users from "../data/mock_users.json";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");

    // Phone validation
    if (!/^\d{10}$/.test(phone)) {
      setError("Phone number must be 10 digits.");
      return;
    }

    const user = users.find(u => u.phone === phone);

    if (!user) {
      setError("No user found with that phone number.");
      return;
    }

    if (user.password !== password) {
      setError("Incorrect password.");
      return;
    }

    // Success
    router.replace("/home");
  };

  return (
    <View className="flex-1 bg-white justify-center px-8">
      <Text className="text-4xl font-bold text-center mb-10">CrossPaths</Text>

      <View className="bg-gray-50 px-6 py-8 rounded-2xl shadow-md">
        <Text className="text-2xl font-semibold mb-6 text-center">Login</Text>

        {/* Phone */}
        <TextInput
          placeholder="Phone Number (10 digits)"
          keyboardType="number-pad"
          value={phone}
          onChangeText={setPhone}
          className="border border-gray-300 bg-white p-4 rounded-xl mb-2"
        />

        {/* Password */}
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          className="border border-gray-300 bg-white p-4 rounded-xl mb-2"
        />

        {/* Error Message */}
        {error !== "" && (
          <Text className="text-red-500 text-center mb-4">{error}</Text>
        )}

        {/* Login button */}
        <TouchableOpacity
          className="bg-blue-600 py-3 rounded-xl mt-3"
          onPress={handleLogin}
        >
          <Text className="text-center text-white text-lg font-semibold">
            Log In
          </Text>
        </TouchableOpacity>

        {/* Nav to register */}
        <TouchableOpacity
          className="mt-6"
          onPress={() => router.push("/register")}
        >
          <Text className="text-center text-blue-600 font-medium">
            Don’t have an account? Register
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
