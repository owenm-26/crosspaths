import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import useAuth from "../hooks/AuthContext";
import { getPendingFriendRequests, getNotifications } from "@/services/inbox";
import { FriendRequest, Notification } from "@/types/inbox";

export default function Inbox() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchInbox = async () => {
      if (!user) return;

      try {
        const requests = await getPendingFriendRequests();
        const notifs = await getNotifications();

        setPendingRequests(requests || []);
        setNotifications(notifs.data || []);
      } catch (err) {
        console.log("Inbox fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInbox();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.center}>
        
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleAcceptFriendRequest = async () =>{

  }

  const handleFriendRequestReject = async () =>{

  }
  return (
    <View style={styles.container}>
      {/* Pending Friend Requests */}
      <Text style={styles.sectionTitle}>Pending Friend Requests</Text>
      {pendingRequests.length === 0 ? (
        <Text style={styles.emptyText}>No pending friend requests.</Text>
      ) : (
        <FlatList
          data={pendingRequests}
          keyExtractor={(item) => item.from_phone}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              
              <View>
                
                <Text style={styles.name}>{item.first_name} {item.last_name}</Text>
                <Text style={styles.phone}>{item.from_phone}</Text>
              </View>
              <TouchableOpacity style={styles.button} onPress={handleAcceptFriendRequest}>
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, {backgroundColor: "#EF4444"}]} onPress={handleFriendRequestReject}>
                <Text style={styles.buttonText}>Deny</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      {/* Notifications */}
      <Text style={styles.sectionTitle}>Notifications</Text>
      {notifications.length === 0 ? (
        <Text style={styles.emptyText}>No notifications.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.message}</Text>
              <Text style={styles.notificationTime}>{item.time}</Text>
            </View>
          )}
        />
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },
  card: {
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
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  phone: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563EB",
    marginTop: 2,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  notificationTime: {
    color: "#888",
    marginTop: 4,
    fontSize: 14,
  },
});
