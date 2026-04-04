import { C } from "@/constants/theme";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const products = [
  {
    id: 1,
    name: "Red Floral Dress",
    price: 2500,
    rent: 500,
    category: "Female",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300",
  },
  {
    id: 2,
    name: "Blue Kurta Set",
    price: 1800,
    rent: 300,
    category: "Female",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300",
  },
  {
    id: 3,
    name: "Wedding Sherwani",
    price: 8000,
    rent: 1500,
    category: "Male",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=300",
  },
  {
    id: 4,
    name: "Casual Shirt",
    price: 1200,
    rent: null,
    category: "Male",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300",
  },
];

const reviews = [
  {
    id: 1,
    name: "Ayesha K.",
    rating: 5,
    comment: "Amazing collection! Very helpful staff and great quality.",
    date: "2 days ago",
  },
  {
    id: 2,
    name: "Omar S.",
    rating: 4,
    comment: "Good quality clothes, reasonable prices. Will visit again.",
    date: "1 week ago",
  },
  {
    id: 3,
    name: "Fatima R.",
    rating: 5,
    comment: "Best shop in the area, highly recommend to everyone!",
    date: "2 weeks ago",
  },
];

export default function ShopDetail() {
  const router = useRouter();
  const [tab, setTab] = useState("products");
  const [shopImage, setShopImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) setShopImage(result.assets[0].uri);
  };

  return (
    <View style={st.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Banner ─────────────────────────────────────────────────────── */}
        <TouchableOpacity onPress={pickImage} activeOpacity={0.9}>
          <Image
            source={{
              uri:
                shopImage ||
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
            }}
            style={st.banner}
          />
          <LinearGradient
            colors={["transparent", "rgba(255,245,247,0.85)"]}
            style={st.bannerGrad}
          />
          <TouchableOpacity style={st.backBtn} onPress={() => router.back()}>
            <Text style={st.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={st.bannerInfo}>
            <View style={st.openBadge}>
              <Text style={st.openBadgeText}>● Open Now</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={st.content}>
          {/* ── Shop Info ──────────────────────────────────────────────── */}
          <View style={st.shopHeader}>
            <View style={st.titleRow}>
              <Text style={st.shopName}>Zara Boutique</Text>
              <View style={st.verifiedBadge}>
                <Text style={st.verifiedText}>✓</Text>
              </View>
            </View>
            <Text style={st.shopCategory}>Female Wear · Local Boutique</Text>
          </View>

          {/* ── Meta row ───────────────────────────────────────────────── */}
          <View style={st.metaRow}>
            {[
              { value: "★ 4.8", label: "Rating" },
              { value: "0.3 km", label: "Distance" },
              { value: "240+", label: "Products" },
              { value: "4.2K", label: "Reviews" },
            ].map((m, i) => (
              <React.Fragment key={m.label}>
                {i > 0 && <View style={st.metaDivider} />}
                <View style={st.metaItem}>
                  <Text style={st.metaValue}>{m.value}</Text>
                  <Text style={st.metaLabel}>{m.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>

          {/* ── Badges ─────────────────────────────────────────────────── */}
          <View style={st.badgesRow}>
            <View style={st.rentBadge}>
              <Text style={st.rentBadgeText}>🏷️ Rental Available</Text>
            </View>
            <View style={st.bulkBadge}>
              <Text style={st.bulkBadgeText}>📦 Bulk Orders</Text>
            </View>
          </View>

          {/* ── Map button ─────────────────────────────────────────────── */}
          <TouchableOpacity
            style={st.mapBtn}
            onPress={() => router.push("/map")}
          >
            <Text style={st.mapBtnText}>📍 View on Map</Text>
            <Text style={st.mapBtnSub}>Tap to see location · 0.3 km away</Text>
          </TouchableOpacity>

          {/* ── Tabs ───────────────────────────────────────────────────── */}
          <View style={st.tabs}>
            {["products", "reviews"].map((t) => (
              <TouchableOpacity
                key={t}
                style={[st.tab, tab === t && st.tabActive]}
                onPress={() => setTab(t)}
              >
                {tab === t ? (
                  <LinearGradient
                    colors={[C.primary, C.primaryDark]}
                    style={st.tabGrad}
                  >
                    <Text style={st.tabTextActive}>
                      {t === "products" ? "Products" : "Reviews"}
                    </Text>
                  </LinearGradient>
                ) : (
                  <Text style={st.tabText}>
                    {t === "products" ? "Products" : "Reviews"}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Products tab ───────────────────────────────────────────── */}
          {tab === "products" && (
            <View style={st.productGrid}>
              {products.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={st.productCard}
                  onPress={() => router.push("/productdetail")}
                  activeOpacity={0.85}
                >
                  <Image source={{ uri: p.image }} style={st.productImage} />
                  {p.rent && (
                    <View style={st.rentTag}>
                      <Text style={st.rentTagText}>Rentable</Text>
                    </View>
                  )}
                  <View style={st.productInfo}>
                    <Text style={st.productName} numberOfLines={1}>
                      {p.name}
                    </Text>
                    <Text style={st.productCat}>{p.category}</Text>
                    <Text style={st.productPrice}>
                      ₹ {p.price.toLocaleString()}
                    </Text>
                    {p.rent && (
                      <Text style={st.productRent}>Rent: ₹{p.rent}/day</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ── Reviews tab ────────────────────────────────────────────── */}
          {tab === "reviews" && (
            <View>
              {reviews.map((r) => (
                <View key={r.id} style={st.reviewCard}>
                  <View style={st.reviewTop}>
                    <View style={st.reviewAvatar}>
                      <Text style={st.reviewAvatarText}>
                        {r.name.charAt(0)}
                      </Text>
                    </View>
                    <View style={st.reviewMeta}>
                      <Text style={st.reviewName}>{r.name}</Text>
                      <Text style={st.reviewDate}>{r.date}</Text>
                    </View>
                    <Text style={st.reviewStars}>{"★".repeat(r.rating)}</Text>
                  </View>
                  <Text style={st.reviewComment}>{r.comment}</Text>
                </View>
              ))}
              <TouchableOpacity
                style={st.writeReviewBtn}
                onPress={() => router.push("/reviews")}
              >
                <Text style={st.writeReviewText}>✍️ Write a Review</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 90 }} />
        </View>
      </ScrollView>

      {/* ── Bottom bar ─────────────────────────────────────────────────────── */}
      <View style={st.bottomBar}>
        <TouchableOpacity
          style={st.orderBtn}
          onPress={() => router.push("/cart")}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[C.primary, C.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={st.orderBtnGrad}
          >
            <Text style={st.orderBtnText}>Order Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  banner: { width: "100%", height: 260 },
  bannerGrad: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  backBtn: {
    position: "absolute",
    top: 56,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: { color: C.text, fontSize: 20, fontWeight: "600" },
  bannerInfo: { position: "absolute", bottom: 16, left: 20 },
  openBadge: {
    backgroundColor: "rgba(76,175,80,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: "rgba(76,175,80,0.3)",
  },
  openBadgeText: { color: C.success, fontSize: 12, fontWeight: "700" },

  content: { padding: 20 },
  shopHeader: { marginBottom: 16 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  shopName: { fontSize: 26, fontWeight: "900", color: C.text },
  verifiedBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.success,
    alignItems: "center",
    justifyContent: "center",
  },
  verifiedText: { color: C.white, fontSize: 12, fontWeight: "900" },
  shopCategory: { fontSize: 14, color: C.textSec },

  metaRow: {
    flexDirection: "row",
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  metaItem: { flex: 1, alignItems: "center" },
  metaValue: {
    fontSize: 15,
    fontWeight: "800",
    color: C.text,
    marginBottom: 2,
  },
  metaLabel: { fontSize: 11, color: C.textMuted },
  metaDivider: { width: 1, backgroundColor: C.border },

  badgesRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  rentBadge: {
    backgroundColor: "rgba(76,175,80,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(76,175,80,0.2)",
  },
  rentBadgeText: { color: C.success, fontSize: 12, fontWeight: "600" },
  bulkBadge: {
    backgroundColor: "rgba(255,152,0,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,152,0,0.2)",
  },
  bulkBadgeText: { color: C.warning, fontSize: 12, fontWeight: "600" },

  mapBtn: {
    backgroundColor: C.primarySoft,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
  },
  mapBtnText: { color: C.primary, fontWeight: "700", fontSize: 15 },
  mapBtnSub: { color: C.textMuted, fontSize: 12, marginTop: 3 },

  tabs: {
    flexDirection: "row",
    backgroundColor: C.surface,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  tab: { flex: 1, borderRadius: 10, overflow: "hidden" },
  tabGrad: { padding: 11, alignItems: "center", borderRadius: 10 },
  tabText: {
    color: C.textMuted,
    fontWeight: "600",
    fontSize: 14,
    padding: 11,
    textAlign: "center",
  },
  tabTextActive: { color: C.white, fontWeight: "700", fontSize: 14 },

  productGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  productCard: {
    width: "47.5%",
    backgroundColor: C.card,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: { width: "100%", height: 140 },
  rentTag: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: C.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  rentTagText: { color: C.white, fontSize: 10, fontWeight: "700" },
  productInfo: { padding: 12 },
  productName: {
    fontSize: 13,
    fontWeight: "700",
    color: C.text,
    marginBottom: 2,
  },
  productCat: { fontSize: 11, color: C.textMuted, marginBottom: 6 },
  productPrice: { fontSize: 14, fontWeight: "800", color: C.primary },
  productRent: { fontSize: 11, color: C.textSec, marginTop: 2 },

  reviewCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  reviewTop: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  reviewAvatarText: { color: C.primary, fontWeight: "900", fontSize: 16 },
  reviewMeta: { flex: 1 },
  reviewName: { fontSize: 14, fontWeight: "700", color: C.text },
  reviewDate: { fontSize: 11, color: C.textMuted, marginTop: 2 },
  reviewStars: { color: C.gold, fontSize: 13 },
  reviewComment: { fontSize: 13, color: C.textSec, lineHeight: 20 },

  writeReviewBtn: {
    backgroundColor: C.primarySoft,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
    marginTop: 4,
  },
  writeReviewText: { color: C.primary, fontWeight: "700", fontSize: 14 },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: C.bg,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  orderBtn: { borderRadius: 16, overflow: "hidden" },
  orderBtnGrad: { padding: 17, alignItems: "center" },
  orderBtnText: { color: C.white, fontSize: 16, fontWeight: "700" },
});
