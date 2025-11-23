import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import users from "../data/mock_users.json"

export default function RegisterScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [homeBaseCity, setHomeBaseCity] = useState("");
  const [homeBaseCountry, setHomeBaseCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleRegister = () => {
    setError("");

    // Phone must be 10 digits
    if (!/^\d{10}$/.test(phone)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    // Phone number must be unique
    const exists = users.some(u => u.phone === phone);
    if (exists) {
      setError("A user with this phone number already exists.");
      return;
    }

    // Password match
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    // Mock success → navigate to home
    Alert.alert("Success", "Account created!");
    router.replace("/home");
  };

  return (
    <ScrollView className="flex-1 bg-white px-8 py-10">
      <Text className="text-3xl font-bold text-center mb-8">
        Create Account
      </Text>

      <View className="bg-gray-50 p-6 rounded-2xl shadow-md">

        <TextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          className="border bg-white border-gray-300 p-4 rounded-xl mb-4"
        />

        <TextInput
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          className="border bg-white border-gray-300 p-4 rounded-xl mb-4"
        />

        <TextInput
          placeholder="Home Base City"
          value={homeBaseCity}
          onChangeText={setHomeBaseCity}
          className="border bg-white border-gray-300 p-4 rounded-xl mb-4"
        />

        <TextInput
          placeholder="Home Base Country"
          value={homeBaseCountry}
          onChangeText={setHomeBaseCountry}
          className="border bg-white border-gray-300 p-4 rounded-xl mb-4"
        />

        <TextInput
          placeholder="Phone Number (10 digits)"
          keyboardType="number-pad"
          value={phone}
          onChangeText={setPhone}
          className="border bg-white border-gray-300 p-4 rounded-xl mb-4"
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          className="border bg-white border-gray-300 p-4 rounded-xl mb-4"
        />

        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
          className="border bg-white border-gray-300 p-4 rounded-xl mb-4"
        />

        {/* Error message in red */}
        {error !== "" && (
          <Text className="text-red-500 text-center mb-4">{error}</Text>
        )}

        <TouchableOpacity
          className="bg-green-600 py-3 rounded-xl"
          onPress={handleRegister}
        >
          <Text className="text-center text-white text-lg font-semibold">
            Sign Up
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-6"
          onPress={() => router.push("/login")}
        >
          <Text className="text-center text-blue-600 font-medium">
            Already have an account? Log In
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}
