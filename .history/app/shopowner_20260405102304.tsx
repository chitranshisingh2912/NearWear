import { C } from "@/constants/theme";
import { useRouter } from "expo-router";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import AIUploadScreen from "./aiupload";
import { auth, db } from "./firebaseConfig";

export default function ShopOwnerDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("dashboard");
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [shopName, setShopName] = useState("");
  const [shopCategory, setShopCategory] = useState("Female Wear");
  const [shopAddress, setShopAddress] = useState("");
  const [shopPhone, setShopPhone] = useState("");
  const [shopDesc, setShopDesc] = useState("");
  const [rentAvailable, setRentAvailable] = useState(false);
  const [bulkAvailable, setBulkAvailable] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const categories = [
    "Female Wear",
    "Male Wear",
    "Both",
    "Bulk Orders",
    "Kids Wear",
  ];

  useEffect(() => {
    fetchMyShops();
  }, []);

  const fetchMyShops = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(
        collection(db, "shops"),
        where("ownerId", "==", user.uid),
      );
      const snap = await getDocs(q);
      setShops(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (_) {}
  };

  const handleAddShop = async () => {
    if (!shopName || !shopAddress || !shopPhone) {
      setError("Please fill all required fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const user = auth.currentUser;
      await addDoc(collection(db, "shops"), {
        name: shopName,
        category: shopCategory,
        address: shopAddress,
        phone: shopPhone,
        description: shopDesc,
        rentAvailable,
        bulkAvailable,
        ownerId: user?.uid,
        ownerEmail: user?.email,
        status: "pending",
        rating: 0,
        createdAt: new Date().toISOString(),
      });
      setSuccess("✅ Shop submitted for admin approval!");
      setShopName("");
      setShopAddress("");
      setShopPhone("");
      setShopDesc("");
      fetchMyShops();
    } catch (_) {
      setError("Failed to add shop. Try again.");
    }
    setLoading(false);
  };

  const TABS = [
    { key: "dashboard", label: "📊 Stats" },
    { key: "addshop", label: "➕ Add" },
    { key: "myshops", label: "🏪 Shops" },
    { key: "aiupload", label: "🤖 AI" },
  ];

  return (
    <View style={so.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <View style={so.header}>
        <TouchableOpacity style={so.backBtn} onPress={() => router.back()}>
          <Text style={so.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={so.title}>🏪 Shop Owner</Text>
        <View style={{ width: 70 }} />
      </View>

      {/* Tabs */}
      <View style={so.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[so.tab, tab === t.key && so.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[so.tabText, tab === t.key && so.tabTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={so.content} showsVerticalScrollIndicator={false}>
        {/* ── Dashboard ──────────────────────────────────────────────────── */}
        {tab === "dashboard" && (
          <View>
            <View style={so.statsGrid}>
              {[
                { num: shops.length, label: "My Shops" },
                {
                  num: shops.filter((s) => s.status === "approved").length,
                  label: "Approved",
                },
                {
                  num: shops.filter((s) => s.status === "pending").length,
                  label: "Pending",
                },
                { num: 0, label: "Orders" },
              ].map((st) => (
                <View key={st.label} style={so.statBox}>
                  <Text style={so.statNum}>{st.num}</Text>
                  <Text style={so.statLabel}>{st.label}</Text>
                </View>
              ))}
            </View>
            <View style={so.infoBox}>
              <Text style={so.infoTitle}>📋 How it works</Text>
              {[
                "1. Add your shop details",
                "2. Admin reviews your request",
                "3. Once approved, shop goes live",
                "4. Customers can find and order from you",
              ].map((t) => (
                <Text key={t} style={so.infoText}>
                  {t}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* ── Add Shop ───────────────────────────────────────────────────── */}
        {tab === "addshop" && (
          <View style={so.form}>
            <Text style={so.formTitle}>Add New Shop</Text>

            {error ? (
              <View style={so.errorBox}>
                <Text style={so.errorText}>⚠️ {error}</Text>
              </View>
            ) : null}
            {success ? (
              <View style={so.successBox}>
                <Text style={so.successText}>{success}</Text>
              </View>
            ) : null}

            <Text style={so.label}>Shop Name *</Text>
            <TextInput
              style={so.input}
              placeholder="Enter shop name"
              placeholderTextColor={C.textMuted}
              value={shopName}
              onChangeText={setShopName}
            />

            <Text style={so.label}>Category *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginBottom: 8 }}
            >
              {categories.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[so.catBtn, shopCategory === c && so.catActive]}
                  onPress={() => setShopCategory(c)}
                >
                  <Text
                    style={[so.catText, shopCategory === c && so.catTextActive]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={so.label}>Address *</Text>
            <TextInput
              style={so.input}
              placeholder="Full shop address"
              placeholderTextColor={C.textMuted}
              value={shopAddress}
              onChangeText={setShopAddress}
            />

            <Text style={so.label}>Phone *</Text>
            <TextInput
              style={so.input}
              placeholder="Contact number"
              placeholderTextColor={C.textMuted}
              value={shopPhone}
              onChangeText={setShopPhone}
              keyboardType="phone-pad"
            />

            <Text style={so.label}>Description</Text>
            <TextInput
              style={[so.input, so.textArea]}
              placeholder="Describe your shop..."
              placeholderTextColor={C.textMuted}
              value={shopDesc}
              onChangeText={setShopDesc}
              multiline
            />

            <View style={so.toggleRow}>
              {[
                {
                  label: "🏷️ Rent Available",
                  val: rentAvailable,
                  set: setRentAvailable,
                },
                {
                  label: "📦 Bulk Orders",
                  val: bulkAvailable,
                  set: setBulkAvailable,
                },
              ].map((tog) => (
                <TouchableOpacity
                  key={tog.label}
                  style={[so.toggleBtn, tog.val && so.toggleActive]}
                  onPress={() => tog.set(!tog.val)}
                >
                  <Text style={[so.toggleText, tog.val && so.toggleTextActive]}>
                    {tog.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={so.submitBtn}
              onPress={handleAddShop}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={C.white} />
              ) : (
                <Text style={so.submitText}>Submit for Approval</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* ── My Shops ───────────────────────────────────────────────────── */}
        {tab === "myshops" && (
          <View>
            {shops.length === 0 ? (
              <View style={so.emptyBox}>
                <Text style={so.emptyEmoji}>🏪</Text>
                <Text style={so.emptyText}>No shops yet!</Text>
                <Text style={so.emptySub}>
                  Add your first shop to get started
                </Text>
              </View>
            ) : (
              shops.map((shop) => (
                <View key={shop.id} style={so.shopCard}>
                  <View style={so.shopCardTop}>
                    <Text style={so.shopCardName}>{shop.name}</Text>
                    <Text
                      style={[
                        so.shopStatus,
                        shop.status === "approved"
                          ? so.statusApproved
                          : shop.status === "rejected"
                            ? so.statusRejected
                            : so.statusPending,
                      ]}
                    >
                      {shop.status === "approved"
                        ? "✅ Approved"
                        : shop.status === "rejected"
                          ? "❌ Rejected"
                          : "⏳ Pending"}
                    </Text>
                  </View>
                  <Text style={so.shopCardCat}>{shop.category}</Text>
                  <Text style={so.shopCardMeta}>📍 {shop.address}</Text>
                  <Text style={so.shopCardMeta}>📞 {shop.phone}</Text>
                </View>
              ))
            )}
          </View>
        )}

        {/* ── AI Upload ──────────────────────────────────────────────────── */}
        {tab === "aiupload" && <AIUploadScreen />}
      </ScrollView>
    </View>
  );
}

const so = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: C.bg,
  },
  backBtn: { paddingVertical: 8, paddingRight: 12 },
  backText: { color: C.primary, fontSize: 15, fontWeight: "600" },
  title: { fontSize: 20, fontWeight: "900", color: C.text },

  tabs: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: C.surface,
    borderRadius: 12,
    padding: 4,
  },
  tab: { flex: 1, padding: 10, alignItems: "center", borderRadius: 10 },
  tabActive: { backgroundColor: C.primary },
  tabText: { color: C.textMuted, fontSize: 12, fontWeight: "700" },
  tabTextActive: { color: C.white },

  content: { paddingHorizontal: 16 },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNum: { fontSize: 28, fontWeight: "900", color: C.primary },
  statLabel: { color: C.textSec, fontSize: 13, marginTop: 4 },

  infoBox: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 16,
  },
  infoTitle: {
    color: C.text,
    fontWeight: "800",
    fontSize: 15,
    marginBottom: 12,
  },
  infoText: { color: C.textSec, fontSize: 14, marginBottom: 8 },

  form: { paddingBottom: 40 },
  formTitle: {
    color: C.text,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 20,
  },

  errorBox: {
    backgroundColor: "rgba(229,57,53,0.08)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(229,57,53,0.25)",
  },
  errorText: { color: C.error, fontSize: 13 },
  successBox: {
    backgroundColor: "rgba(76,175,80,0.08)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(76,175,80,0.25)",
  },
  successText: { color: C.success, fontSize: 13 },

  label: {
    color: C.textSec,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 15,
    color: C.text,
    fontSize: 15,
    borderWidth: 1,
    borderColor: C.inputBorder,
  },
  textArea: { height: 100, textAlignVertical: "top" },

  catBtn: {
    backgroundColor: C.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  catActive: { backgroundColor: C.primary, borderColor: C.primary },
  catText: { color: C.textSec, fontSize: 13 },
  catTextActive: { color: C.white, fontWeight: "700" },

  toggleRow: { flexDirection: "row", gap: 12, marginTop: 16, marginBottom: 24 },
  toggleBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
  },
  toggleActive: { backgroundColor: C.primarySoft, borderColor: C.primary },
  toggleText: { color: C.textSec, fontSize: 13, fontWeight: "700" },
  toggleTextActive: { color: C.primary },

  submitBtn: {
    backgroundColor: C.primary,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  submitText: { color: C.white, fontWeight: "700", fontSize: 16 },

  emptyBox: { alignItems: "center", padding: 40 },
  emptyEmoji: { fontSize: 52, marginBottom: 16 },
  emptyText: { color: C.text, fontSize: 20, fontWeight: "800" },
  emptySub: { color: C.textMuted, fontSize: 14, marginTop: 8 },

  shopCard: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  shopCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  shopCardName: { color: C.text, fontWeight: "800", fontSize: 16 },
  shopStatus: { fontSize: 12, fontWeight: "700" },
  statusApproved: { color: C.success },
  statusRejected: { color: C.error },
  statusPending: { color: C.warning },
  shopCardCat: { color: C.textSec, fontSize: 13, marginBottom: 4 },
  shopCardMeta: { color: C.textMuted, fontSize: 13, marginBottom: 2 },
});
