import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import {FriendDistance} from "@/types/home"
import { getFriendDistances } from "@/services/friendDistances";
import useAuth from "../hooks/AuthContext";

export default function Home() {
  const {user} = useAuth()
  const [loading, setLoading] = useState(true);

  const [friendDistances, setFriendDistances] = useState<FriendDistance[]>([]);

  useEffect(() =>{
    // Get all friend distances
    const getDistance = async () =>{
      if(!user) {
        setLoading(false);
        return
      }
    const res = await getFriendDistances(user?.phone_number)

    if(res) setFriendDistances(res)
    setLoading(false);
    }
    getDistance()
  },[])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (friendDistances.length === 0) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 16, textAlign: "center", color: "#555" }}>
          No friends found nearby.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={friendDistances}
      keyExtractor={(item) => item.user.phone_number}
      contentContainerStyle={{ padding: 20 }}
      renderItem={({ item }) => (
        <View
          style={{
            padding: 16,
            backgroundColor: "#fff",
            marginBottom: 12,
            borderRadius: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <View style={{ flexShrink: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              {item.user.first_name} {item.user.last_name}
            </Text>

            <Text style={{ color: "#666", marginTop: 2 }}>
              {item.user.city}
            </Text>
          </View>

          <Text style={{ fontSize: 18, fontWeight: "700", color: "#2563EB" }}>
            {item.distance.toFixed(1)} mi
          </Text>
        </View>
      )}
    />
  );
}