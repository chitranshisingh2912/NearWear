import { useRouter } from "expo-router";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { db } from "../firebaseConfig";

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
  warning: "#F59E0B",
  white: "#FFFFFF",
};

export default function AdminPanel() {
  const router = useRouter();
  const [tab, setTab] = useState("shops");
  const [shops, setShops] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const shopsSnap = await getDocs(collection(db, "shops"));
      setShops(shopsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      const usersSnap = await getDocs(collection(db, "users"));
      setUsers(usersSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const updateShopStatus = async (shopId: string, status: string) => {
    try {
      await updateDoc(doc(db, "shops", shopId), { status });
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const pending = shops.filter((s) => s.status === "pending");
  const approved = shops.filter((s) => s.status === "approved");
  const rejected = shops.filter((s) => s.status === "rejected");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🔧 Admin Panel</Text>
      </View>

      <View style={styles.statsRow}>
        {[
          { num: users.length, label: "Users", color: C.primary },
          { num: shops.length, label: "Shops", color: C.primary },
          { num: pending.length, label: "Pending", color: C.warning },
          { num: approved.length, label: "Approved", color: C.success },
        ].map((s) => (
          <View key={s.label} style={styles.statBox}>
            <Text style={[styles.statNum, { color: s.color }]}>{s.num}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.tabs}>
        {["shops", "users"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === "shops" ? "🏪 Shops" : "👥 Users"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={C.primary}
          style={{ marginTop: 40 }}
        />
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {tab === "shops" && (
            <View>
              {shops.length === 0 && (
                <Text style={styles.emptyText}>No shops found</Text>
              )}
              {pending.map((shop) => (
                <View
                  key={shop.id}
                  style={[styles.shopCard, styles.pendingCard]}
                >
                  <Text style={styles.shopName}>{shop.name}</Text>
                  <Text style={styles.shopInfo}>
                    {shop.category} • {shop.address}
                  </Text>
                  <Text style={styles.shopStatus}>⏳ Pending Approval</Text>
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.approveBtn}
                      onPress={() => updateShopStatus(shop.id, "approved")}
                    >
                      <Text style={styles.approveBtnText}>✅ Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rejectBtn}
                      onPress={() => updateShopStatus(shop.id, "rejected")}
                    >
                      <Text style={styles.rejectBtnText}>❌ Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              {approved.map((shop) => (
                <View
                  key={shop.id}
                  style={[styles.shopCard, styles.approvedCard]}
                >
                  <Text style={styles.shopName}>{shop.name}</Text>
                  <Text style={styles.shopInfo}>
                    {shop.category} • {shop.address}
                  </Text>
                  <Text style={[styles.shopStatus, { color: C.success }]}>
                    ✅ Approved
                  </Text>
                  <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() => updateShopStatus(shop.id, "rejected")}
                  >
                    <Text style={styles.rejectBtnText}>❌ Reject</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {rejected.map((shop) => (
                <View
                  key={shop.id}
                  style={[styles.shopCard, styles.rejectedCard]}
                >
                  <Text style={styles.shopName}>{shop.name}</Text>
                  <Text style={styles.shopInfo}>
                    {shop.category} • {shop.address}
                  </Text>
                  <Text style={[styles.shopStatus, { color: C.error }]}>
                    ❌ Rejected
                  </Text>
                  <TouchableOpacity
                    style={styles.approveBtn}
                    onPress={() => updateShopStatus(shop.id, "approved")}
                  >
                    <Text style={styles.approveBtnText}>✅ Re-Approve</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          {tab === "users" && (
            <View>
              {users.length === 0 && (
                <Text style={styles.emptyText}>No users found</Text>
              )}
              {users.map((user) => (
                <View key={user.id} style={styles.shopCard}>
                  <Text style={styles.shopName}>{user.name || "Unknown"}</Text>
                  <Text style={styles.shopInfo}>{user.email}</Text>
                  <Text style={styles.shopInfo}>
                    Role: {user.role || "customer"}
                  </Text>
                </View>
              ))}
            </View>
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  backText: { color: C.primary, fontSize: 16, fontWeight: "700" },
  title: { fontSize: 22, fontWeight: "800", color: C.text },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  statNum: { fontSize: 22, fontWeight: "900" },
  statLabel: {
    color: C.textMuted,
    fontSize: 11,
    marginTop: 3,
    fontWeight: "600",
  },
  tabs: {
    flexDirection: "row",
    marginHorizontal: 16,
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  tab: { flex: 1, padding: 10, alignItems: "center", borderRadius: 10 },
  tabActive: { backgroundColor: C.primary },
  tabText: { color: C.textMuted, fontWeight: "700", fontSize: 14 },
  tabTextActive: { color: C.white },
  list: { paddingHorizontal: 16 },
  shopCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: C.borderLight,
  },
  pendingCard: { borderColor: C.warning },
  approvedCard: { borderColor: C.success },
  rejectedCard: { borderColor: C.error },
  shopName: { color: C.text, fontWeight: "800", fontSize: 16, marginBottom: 4 },
  shopInfo: { color: C.textSec, fontSize: 13, marginBottom: 3 },
  shopStatus: {
    fontSize: 13,
    fontWeight: "700",
    color: C.warning,
    marginBottom: 10,
  },
  actionRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  approveBtn: {
    flex: 1,
    backgroundColor: "rgba(16,185,129,0.08)",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.25)",
    marginTop: 8,
  },
  approveBtnText: { color: C.success, fontWeight: "700", fontSize: 13 },
  rejectBtn: {
    flex: 1,
    backgroundColor: "rgba(239,68,68,0.08)",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.25)",
    marginTop: 8,
  },
  rejectBtnText: { color: C.error, fontWeight: "700", fontSize: 13 },
  emptyText: {
    color: C.textMuted,
    textAlign: "center",
    marginTop: 40,
    fontSize: 15,
  },
});
