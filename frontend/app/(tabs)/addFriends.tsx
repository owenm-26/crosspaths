import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { getUserBasicsById } from "@/services/users";
import { UserBasics } from "@/types/user";
import useAuth from "../hooks/AuthContext";

export default function AddFriends() {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<UserBasics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {user} = useAuth();

  const searchUser = async () => {
    if (!phone) {
      setError("Please enter a phone number");
      return;
    }

    if(phone == user?.phone_number){
      setError("You cannot make friends with yourself");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res: UserBasics | null = await getUserBasicsById(phone);
      if (!res) throw new Error("User not found");

      setResult(res);
    } catch (err) {
      setError("No user found with that phone number");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Friends</Text>

      <TextInput
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        placeholderTextColor="#888"
      />

      <TouchableOpacity onPress={searchUser} style={styles.button}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator size="large" style={{ marginTop: 30 }} />
      )}

      {error !== "" && (
        <Text style={styles.error}>{error}</Text>
      )}

      {result && (
        <View style={styles.card}>
          <View>
            <Text style={styles.name}>
              {result.first_name} {result.last_name}
            </Text>
          </View>
          <Text style={styles.phone}>{result.phone_number}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 14,
    marginTop: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
  },
  card: {
    marginTop: 25,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  city: {
    color: "#666",
    marginTop: 2,
  },
  phone: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563EB",
  },
});
