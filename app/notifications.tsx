import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const notificationsList = [
  {
    id: 1,
    title: "🛵 Rider is on the way!",
    body: "Your order #NW-001 is out for delivery",
    time: "2 mins ago",
    read: false,
  },
  {
    id: 2,
    title: "✅ Order Confirmed!",
    body: "Zara Boutique confirmed your order",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    title: "🏪 New Shop Added!",
    body: "Style Palace just joined NearWear near you",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 4,
    title: "⭐ Review Request",
    body: "How was your order from Men's Empire?",
    time: "1 day ago",
    read: true,
  },
  {
    id: 5,
    title: "🏷️ Rental Reminder",
    body: "Return your Wedding Sherwani tomorrow",
    time: "2 days ago",
    read: true,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(notificationsList);
  const [expoPushToken, setExpoPushToken] = useState("");

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") return;
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      setExpoPushToken(token.data);
    } catch (err) {
      console.log(err);
    }
  };

  const sendTestNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🛵 Test Notification!",
        body: "NearWear notifications are working!",
        sound: true,
      },
      trigger: { seconds: 2 },
    });
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🔔 Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markRead}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Text style={styles.unreadText}>
            🔴 {unreadCount} unread notifications
          </Text>
        </View>
      )}

      <ScrollView style={styles.list}>
        {notifications.map((n) => (
          <TouchableOpacity
            key={n.id}
            style={[styles.notifCard, !n.read && styles.notifUnread]}
            onPress={() =>
              setNotifications(
                notifications.map((notif) =>
                  notif.id === n.id ? { ...notif, read: true } : notif,
                ),
              )
            }
          >
            <View style={styles.notifContent}>
              <Text style={styles.notifTitle}>{n.title}</Text>
              <Text style={styles.notifBody}>{n.body}</Text>
              <Text style={styles.notifTime}>{n.time}</Text>
            </View>
            {!n.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.testBtn} onPress={sendTestNotification}>
          <Text style={styles.testBtnText}>🔔 Send Test Notification</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a2e" },
  header: {
    padding: 24,
    paddingTop: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  back: { color: "#e94560", fontSize: 16 },
  title: { flex: 1, fontSize: 22, fontWeight: "bold", color: "#fff" },
  markRead: { color: "#e94560", fontSize: 13 },
  unreadBanner: {
    marginHorizontal: 16,
    backgroundColor: "#0f3460",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e94560",
  },
  unreadText: { color: "#e94560", fontSize: 13, fontWeight: "bold" },
  list: { padding: 16 },
  notifCard: {
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  notifUnread: { borderColor: "#e94560", backgroundColor: "#1a1a3e" },
  notifContent: { flex: 1 },
  notifTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  notifBody: { color: "#a0a0b0", fontSize: 13, marginBottom: 4 },
  notifTime: { color: "#666", fontSize: 11 },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e94560",
    marginLeft: 8,
  },
  testBtn: {
    backgroundColor: "#0f3460",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "#e94560",
  },
  testBtnText: { color: "#e94560", fontWeight: "bold", fontSize: 14 },
});
