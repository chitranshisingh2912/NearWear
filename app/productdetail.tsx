import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ProductDetail() {
  const router = useRouter();
  const [mode, setMode] = useState("buy");

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>
        </View>

        {/* Product Image Placeholder */}
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageEmoji}>👗</Text>
        </View>

        {/* Product Info */}
        <View style={styles.infoBox}>
          <Text style={styles.productName}>Red Floral Dress</Text>
          <Text style={styles.shopName}>🏪 Zara Boutique</Text>
          <View style={styles.row}>
            <Text style={styles.rating}>⭐ 4.8</Text>
            <Text style={styles.category}>👗 Female Wear</Text>
          </View>

          {/* Buy or Rent Toggle */}
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, mode === "buy" && styles.toggleActive]}
              onPress={() => setMode("buy")}
            >
              <Text
                style={[
                  styles.toggleText,
                  mode === "buy" && styles.toggleTextActive,
                ]}
              >
                🛒 Buy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, mode === "rent" && styles.toggleActive]}
              onPress={() => setMode("rent")}
            >
              <Text
                style={[
                  styles.toggleText,
                  mode === "rent" && styles.toggleTextActive,
                ]}
              >
                🏷️ Rent
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.price}>
            {mode === "buy" ? "Rs. 2,500" : "Rs. 500 / day"}
          </Text>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            Beautiful red floral dress perfect for casual and semi-formal
            occasions. Available in sizes S, M, L, XL. Made with premium fabric
            for maximum comfort.
          </Text>

          <Text style={styles.sectionTitle}>Sizes Available</Text>
          <View style={styles.sizeRow}>
            {["S", "M", "L", "XL"].map((s) => (
              <TouchableOpacity key={s} style={styles.sizeBtn}>
                <Text style={styles.sizeText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* AI Suggestion Box */}
          <View style={styles.aiBox}>
            <Text style={styles.aiTitle}>🤖 AI Style Suggestion</Text>
            <Text style={styles.aiText}>
              Pair this dress with nude heels and a gold clutch for a complete
              look. Available at: Style Street (0.5 km away)
            </Text>
            <TouchableOpacity
              style={styles.aiBtn}
              onPress={() => router.push("/aistylist")}
            >
              <Text style={styles.aiBtnText}>Get Full Outfit Idea →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => router.push("/cart")}
        >
          <Text style={styles.cartBtnText}>
            {mode === "buy" ? "🛒 Add to Cart" : "🏷️ Rent Now"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a2e" },
  header: { padding: 24, paddingTop: 60 },
  back: { color: "#e94560", fontSize: 16 },
  imagePlaceholder: {
    backgroundColor: "#16213e",
    margin: 16,
    borderRadius: 16,
    height: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  imageEmoji: { fontSize: 100 },
  infoBox: { padding: 16 },
  productName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  shopName: { color: "#a0a0b0", fontSize: 14, marginBottom: 8 },
  row: { flexDirection: "row", gap: 12, marginBottom: 16 },
  rating: { color: "#a0a0b0", fontSize: 14 },
  category: { color: "#a0a0b0", fontSize: 14 },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  toggleBtn: { flex: 1, padding: 10, alignItems: "center", borderRadius: 10 },
  toggleActive: { backgroundColor: "#e94560" },
  toggleText: { color: "#a0a0b0", fontWeight: "bold" },
  toggleTextActive: { color: "#fff" },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#e94560",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 8,
  },
  description: { color: "#a0a0b0", fontSize: 14, lineHeight: 22 },
  sizeRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  sizeBtn: {
    backgroundColor: "#16213e",
    padding: 10,
    borderRadius: 8,
    width: 44,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  sizeText: { color: "#fff", fontWeight: "bold" },
  aiBox: {
    backgroundColor: "#0f3460",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e94560",
  },
  aiTitle: {
    color: "#e94560",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 8,
  },
  aiText: { color: "#a0a0b0", fontSize: 13, lineHeight: 20, marginBottom: 10 },
  aiBtn: { alignSelf: "flex-start" },
  aiBtnText: { color: "#e94560", fontWeight: "bold", fontSize: 13 },
  bottomBar: {
    padding: 16,
    backgroundColor: "#16213e",
    borderTopWidth: 1,
    borderTopColor: "#2a2a4a",
  },
  cartBtn: {
    backgroundColor: "#e94560",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cartBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
