// app/cart.tsx  – Pink theme
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  white: "#FFFFFF",
};

const initialItems = [
  {
    id: 1,
    name: "Red Floral Dress",
    shop: "Zara Boutique",
    price: 2500,
    type: "Buy",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200",
    qty: 1,
  },
  {
    id: 2,
    name: "Wedding Sherwani",
    shop: "Men's Empire",
    price: 1500,
    type: "Rent/day",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200",
    qty: 1,
  },
];

export default function CartScreen() {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);

  const removeItem = (id: number) => setItems(items.filter((i) => i.id !== id));
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery = 49;
  const total = subtotal + delivery;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Cart</Text>
        <Text style={styles.itemCount}>{items.length} items</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySub}>
              Add items from local shops to get started
            </Text>
            <TouchableOpacity
              style={styles.shopNowBtn}
              onPress={() => router.push("/home")}
            >
              <LinearGradient
                colors={["#D4437C", "#E91E8C"]}
                style={styles.shopNowGrad}
              >
                <Text style={styles.shopNowText}>Browse Shops</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {items.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <View style={styles.itemTopRow}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <TouchableOpacity onPress={() => removeItem(item.id)}>
                      <Text style={styles.removeBtn}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.itemShop}>{item.shop}</Text>
                  <View style={styles.itemBottomRow}>
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeBadgeText}>{item.type}</Text>
                    </View>
                    <Text style={styles.itemPrice}>
                      Rs. {item.price.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Delivery Info */}
            <View style={styles.deliveryCard}>
              <Text style={styles.deliveryTitle}>Delivery Details</Text>
              <View style={styles.deliveryRow}>
                <View style={styles.deliveryDot} />
                <Text style={styles.deliveryText}>
                  Estimated delivery: 30-45 mins
                </Text>
              </View>
              <View style={styles.deliveryRow}>
                <View style={styles.deliveryDot} />
                <Text style={styles.deliveryText}>
                  Delivery to: Your current location
                </Text>
              </View>
            </View>

            {/* Order Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  Rs. {subtotal.toLocaleString()}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>Rs. {delivery}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryTotal}>Total</Text>
                <Text style={styles.summaryTotalValue}>
                  Rs. {total.toLocaleString()}
                </Text>
              </View>
            </View>
            <View style={{ height: 120 }} />
          </>
        )}
      </ScrollView>

      {items.length > 0 && (
        <View style={styles.bottomBar}>
          <View style={styles.totalPreview}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>Rs. {total.toLocaleString()}</Text>
          </View>
          <TouchableOpacity
            style={styles.placeOrderBtn}
            onPress={() => router.push("/orderconfirm")}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#D4437C", "#E91E8C"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.placeOrderGrad}
            >
              <Text style={styles.placeOrderText}>Place Order</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.border,
    marginRight: 16,
  },
  backIcon: { color: C.primary, fontSize: 20, fontWeight: "600" },
  title: { fontSize: 24, fontWeight: "900", color: C.text, flex: 1 },
  itemCount: { fontSize: 13, color: C.primary, fontWeight: "600" },

  content: { flex: 1, paddingHorizontal: 20 },

  emptyBox: { alignItems: "center", paddingTop: 80 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: C.text,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: C.textMuted,
    marginBottom: 32,
    textAlign: "center",
  },
  shopNowBtn: { borderRadius: 16, overflow: "hidden" },
  shopNowGrad: { paddingHorizontal: 32, paddingVertical: 16 },
  shopNowText: { color: C.white, fontSize: 15, fontWeight: "700" },

  itemCard: {
    flexDirection: "row",
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  itemImage: { width: 80, height: 90, borderRadius: 12 },
  itemInfo: { flex: 1, marginLeft: 14 },
  itemTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "700",
    color: C.text,
    flex: 1,
    marginRight: 8,
  },
  removeBtn: { color: C.textMuted, fontSize: 16 },
  itemShop: { fontSize: 12, color: C.textMuted, marginBottom: 10 },
  itemBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeBadge: {
    backgroundColor: C.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  typeBadgeText: { color: C.primary, fontSize: 11, fontWeight: "600" },
  itemPrice: { fontSize: 16, fontWeight: "800", color: C.text },

  deliveryCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  deliveryTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: C.text,
    marginBottom: 12,
  },
  deliveryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  deliveryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.primary,
  },
  deliveryText: { fontSize: 13, color: C.textSec },

  summaryCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: C.text,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryLabel: { fontSize: 14, color: C.textSec },
  summaryValue: { fontSize: 14, color: C.text, fontWeight: "600" },
  summaryDivider: {
    height: 1,
    backgroundColor: C.borderLight,
    marginVertical: 10,
  },
  summaryTotal: { fontSize: 16, fontWeight: "800", color: C.text },
  summaryTotalValue: { fontSize: 18, fontWeight: "900", color: C.primary },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingBottom: 32,
    backgroundColor: C.bg,
    borderTopWidth: 1,
    borderTopColor: C.borderLight,
    gap: 16,
  },
  totalPreview: {},
  totalLabel: { fontSize: 12, color: C.textMuted },
  totalValue: { fontSize: 20, fontWeight: "900", color: C.text },
  placeOrderBtn: { flex: 1, borderRadius: 16, overflow: "hidden" },
  placeOrderGrad: { padding: 17, alignItems: "center" },
  placeOrderText: { color: C.white, fontSize: 16, fontWeight: "700" },
});
