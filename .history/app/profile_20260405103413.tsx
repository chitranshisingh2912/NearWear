import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "./firebaseConfig";
const C = {
  bg: "#FFF0F3",
  card: "#FFFFFF",
  surface: "#FFE4EC",
  border: "rgba(212,67,124,0.18)",
  borderLight: "rgba(212,67,124,0.10)",
  primary: "#D4437C",
  text: "#1A1A2E",
  textSec: "#5A5A7A",
  textMuted: "#9E9EBE",
  success: "#10B981",
  error: "#EF4444",
  white: "#FFFFFF",
};

const recentOrders = [
  {
    id: "1",
    shop: "Ethnic Elegance",
    items: 2,
    total: 11498,
    status: "Delivered",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200",
  },
  {
    id: "2",
    shop: "The Kurta Company",
    items: 1,
    total: 2999,
    status: "In Transit",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200",
  },
];

const menuItems = [
  {
    id: "orders",
    title: "My Orders",
    subtitle: "3 active orders",
    route: "/orderconfirm",
  },
  {
    id: "wishlist",
    title: "Wishlist",
    subtitle: "12 items saved",
    route: "/home",
  },
  {
    id: "addresses",
    title: "Saved Addresses",
    subtitle: "2 addresses",
    route: "/home",
  },
  {
    id: "rentals",
    title: "Active Rentals",
    subtitle: "View current rentals",
    route: "/orderconfirm",
  },
  {
    id: "notifications",
    title: "Notifications",
    subtitle: "Manage preferences",
    route: "/notifications",
  },
  {
    id: "help",
    title: "Help & Support",
    subtitle: "FAQs, Contact us",
    route: "/home",
  },
  {
    id: "settings",
    title: "Settings",
    subtitle: "App preferences",
    route: "/home",
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) setUserData(snap.data());
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/");
  };
  const initial = userData?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editIcon}>✏</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={["#D4437C", "#E91E8C"]}
            style={styles.profileAvatar}
          >
            <Text style={styles.profileInitial}>{initial}</Text>
          </LinearGradient>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userData?.name || "User"}</Text>
            <Text style={styles.profileEmail}>{userData?.email || ""}</Text>
            <View style={styles.memberBadge}>
              <Text style={styles.memberText}>◆ Premium Member</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { val: "23", label: "Orders" },
            { val: "12", label: "Wishlist" },
            { val: "8", label: "Reviews" },
          ].map((s, i, arr) => (
            <React.Fragment key={s.label}>
              <View style={styles.stat}>
                <Text style={styles.statVal}>{s.val}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
              {i < arr.length - 1 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          {recentOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => router.push("/delivery")}
            >
              <Image source={{ uri: order.image }} style={styles.orderImage} />
              <View style={styles.orderInfo}>
                <Text style={styles.orderShop}>{order.shop}</Text>
                <Text style={styles.orderMeta}>
                  {order.items} items · Rs. {order.total.toLocaleString()}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  order.status === "Delivered"
                    ? styles.statusDelivered
                    : styles.statusTransit,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    order.status === "Delivered"
                      ? styles.statusTextDelivered
                      : styles.statusTextTransit,
                  ]}
                >
                  {order.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index < menuItems.length - 1 && styles.menuItemBorder,
                ]}
                onPress={() => router.push(item.route as any)}
              >
                <View style={styles.menuIconBox}>
                  <Text style={styles.menuIconText}>
                    {item.title.charAt(0)}
                  </Text>
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSub}>{item.subtitle}</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/shopowner")}
            >
              <View style={[styles.actionIcon, { backgroundColor: C.surface }]}>
                <Text style={styles.actionIconText}>🏪</Text>
              </View>
              <Text style={styles.actionText}>Shop Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/admin")}
            >
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: "rgba(245,158,11,0.12)" },
                ]}
              >
                <Text style={styles.actionIconText}>🔧</Text>
              </View>
              <Text style={styles.actionText}>Admin Panel</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        <Text style={styles.version}>NearWear v1.0.0</Text>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 28, fontWeight: "900", color: C.text },
  editBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.border,
  },
  editIcon: { fontSize: 18 },

  content: { flex: 1, paddingHorizontal: 20 },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitial: { fontSize: 32, fontWeight: "900", color: C.white },
  profileInfo: { marginLeft: 16, flex: 1 },
  profileName: { fontSize: 20, fontWeight: "800", color: C.text },
  profileEmail: { fontSize: 13, color: C.textSec, marginTop: 2 },
  memberBadge: {
    backgroundColor: C.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  memberText: { fontSize: 11, color: C.primary, fontWeight: "700" },

  statsRow: {
    flexDirection: "row",
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  stat: { flex: 1, alignItems: "center" },
  statVal: { fontSize: 22, fontWeight: "900", color: C.primary },
  statLabel: { fontSize: 12, color: C.textMuted, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: C.borderLight },

  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: C.text,
    marginBottom: 14,
  },

  orderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  orderImage: { width: 52, height: 52, borderRadius: 10 },
  orderInfo: { flex: 1, marginLeft: 12 },
  orderShop: { fontSize: 14, fontWeight: "700", color: C.text },
  orderMeta: { fontSize: 12, color: C.textMuted, marginTop: 3 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  statusDelivered: {
    backgroundColor: "rgba(16,185,129,0.1)",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.2)",
  },
  statusTransit: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  statusText: { fontSize: 11, fontWeight: "700" },
  statusTextDelivered: { color: C.success },
  statusTextTransit: { color: C.primary },

  menuCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.borderLight,
    overflow: "hidden",
  },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 16 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: C.borderLight },
  menuIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: C.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIconText: { color: C.primary, fontWeight: "900", fontSize: 16 },
  menuContent: { flex: 1, marginLeft: 14 },
  menuTitle: { fontSize: 14, fontWeight: "700", color: C.text },
  menuSub: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  menuArrow: { color: C.primary, fontSize: 20, fontWeight: "300" },

  actionsRow: { flexDirection: "row", gap: 12 },
  actionCard: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  actionIconText: { fontSize: 24 },
  actionText: {
    fontSize: 13,
    color: C.text,
    fontWeight: "600",
    textAlign: "center",
  },

  logoutBtn: { alignItems: "center", paddingVertical: 16, marginTop: 8 },
  logoutText: { fontSize: 15, fontWeight: "700", color: C.error },
  version: {
    fontSize: 12,
    color: C.textMuted,
    textAlign: "center",
    marginTop: 12,
  },
});
