// app/(tabs)/admin2.tsx
import { useRouter } from "expo-router";
import { initializeApp } from "firebase/app";
import {
    collection,
    doc,
    getDocs,
    getFirestore,
    updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyAIwiTEnomwZoNaAd8X_xksN7AepWH64qI",
  authDomain: "nearwear-8fc71.firebaseapp.com",
  projectId: "nearwear-8fc71",
  storageBucket: "nearwear-8fc71.firebasestorage.app",
  messagingSenderId: "658283130251",
  appId: "1:658283130251:web:a6a67638a3cd2eee51938e",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
              {pending.map((shop) => (
                <View
                  key={shop.id}
                  style={[styles.shopCard, styles.pendingCard]}
                >
                  <Text style={styles.shopName}>{shop.name}</Text>
                  <Text style={styles.shopInfo}>
                    {shop.category} • {shop.address}
                  </Text>
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
            </View>
          )}
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
  shopName: { color: C.text, fontWeight: "800", fontSize: 16, marginBottom: 4 },
  shopInfo: { color: C.textSec, fontSize: 13, marginBottom: 3 },
  actionRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  approveBtn: {
    flex: 1,
    backgroundColor: "rgba(16,185,129,0.08)",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.25)",
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
  },
  rejectBtnText: { color: C.error, fontWeight: "700", fontSize: 13 },
});
