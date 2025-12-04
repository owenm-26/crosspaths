import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { registerUser } from "@/services/auth";
import useAuth from "./hooks/AuthContext";

export default function RegisterScreen() {
  const router = useRouter();
  const {user, setUser} = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [homeBaseCity, setHomeBaseCity] = useState("");
  const [homeBaseCountry, setHomeBaseCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    // Phone must be 10 digits
    if (!/^\d{10}$/.test(phone)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    // Password match
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    // build the payload expected by your fastAPI backend
    const payload = {
      phone_number: phone,
      first_name: firstName,
      last_name: lastName,
      home_location: `${homeBaseCity}, ${homeBaseCountry}`,
      curr_location: `${homeBaseCity}, ${homeBaseCountry}`, // placeholder until GPS
      password: password,
      city: homeBaseCity,
    }

    try {
      // try creating user in backend DB
      const res = await registerUser(payload);
      Alert.alert("Success", "Account created!");
      setUser(res)
      router.replace("/(tabs)/home");
    } catch (err) {
      console.log("❌ Registration error:", err);
      console.log("❌ Backend response:", err?.response?.data);

      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Registration failed. Check internet or backend.");
      }
    }
  };

  return (
    <ScrollView
  style={{
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 32, // px-8
    paddingVertical: 40,   // py-10
  }}
>
  <Text
    style={{
      fontSize: 30, // text-3xl
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 32, // mb-8
    }}
  >
    Create Account
  </Text>

  <View
    style={{
      backgroundColor: "#F9FAFB", // bg-gray-50
      padding: 24, // p-6
      borderRadius: 24, // rounded-2xl
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5, // Android shadow
    }}
  >
    <TextInput
      placeholder="First Name"
      value={firstName}
      onChangeText={setFirstName}
      style={{
        borderWidth: 1,
        borderColor: "#D1D5DB", // border-gray-300
        backgroundColor: "white",
        padding: 16, // p-4
        borderRadius: 20, // rounded-xl
        marginBottom: 16, // mb-4
      }}
    />

    <TextInput
      placeholder="Last Name"
      value={lastName}
      onChangeText={setLastName}
      style={{
        borderWidth: 1,
        borderColor: "#D1D5DB",
        backgroundColor: "white",
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
      }}
    />

    <TextInput
      placeholder="Home Base City"
      value={homeBaseCity}
      onChangeText={setHomeBaseCity}
      style={{
        borderWidth: 1,
        borderColor: "#D1D5DB",
        backgroundColor: "white",
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
      }}
    />

    <TextInput
      placeholder="Home Base Country"
      value={homeBaseCountry}
      onChangeText={setHomeBaseCountry}
      style={{
        borderWidth: 1,
        borderColor: "#D1D5DB",
        backgroundColor: "white",
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
      }}
    />

    <TextInput
      placeholder="Phone Number (10 digits)"
      keyboardType="number-pad"
      value={phone}
      onChangeText={setPhone}
      style={{
        borderWidth: 1,
        borderColor: "#D1D5DB",
        backgroundColor: "white",
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
      }}
    />

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
        marginBottom: 16,
      }}
    />

    <TextInput
      placeholder="Confirm Password"
      secureTextEntry
      value={confirm}
      onChangeText={setConfirm}
      style={{
        borderWidth: 1,
        borderColor: "#D1D5DB",
        backgroundColor: "white",
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
      }}
    />

    {/* Error message */}
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

    <TouchableOpacity
      onPress={handleRegister}
      style={{
        backgroundColor: "#16A34A", // bg-green-600
        paddingVertical: 12, // py-3
        borderRadius: 20, // rounded-xl
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
        Sign Up
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => router.push("/login")}
      style={{ marginTop: 24 }} // mt-6
    >
      <Text
        style={{
          textAlign: "center",
          color: "#2563EB", // text-blue-600
          fontWeight: "500", // font-medium
        }}
      >
        Already have an account? Log In
      </Text>
    </TouchableOpacity>
  </View>
</ScrollView>
  );
}
