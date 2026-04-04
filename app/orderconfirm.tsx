import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const steps = [
  { label: "Order Confirmed", sub: "Your order has been placed", done: true },
  { label: "Shop Preparing", sub: "Shop is packing your items", done: true },
  { label: "Rider Picked Up", sub: "Rider is on the way", done: false },
  { label: "Delivered", sub: "Estimated 30-45 mins", done: false },
];

export default function OrderConfirm() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Success */}
        <Animated.View
          style={[
            styles.successBox,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <LinearGradient
            colors={["rgba(16,185,129,0.15)", "rgba(16,185,129,0.05)"]}
            style={styles.successGrad}
          >
            <View style={styles.successIcon}>
              <LinearGradient
                colors={["#10B981", "#059669"]}
                style={styles.successIconGrad}
              >
                <Text style={styles.successCheck}>✓</Text>
              </LinearGradient>
            </View>
            <Text style={styles.successTitle}>Order Placed!</Text>
            <Text style={styles.successSub}>
              Your order has been confirmed successfully
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Order ID */}
        <View style={styles.orderIdCard}>
          <Text style={styles.orderIdLabel}>Order ID</Text>
          <Text style={styles.orderIdValue}>#NW-2024-001</Text>
          <View style={styles.orderIdBadge}>
            <Text style={styles.orderIdBadgeText}>Confirmed</Text>
          </View>
        </View>

        {/* Tracking Steps */}
        <View style={styles.trackingCard}>
          <Text style={styles.trackingTitle}>Order Progress</Text>
          {steps.map((step, index) => (
            <View key={step.label} style={styles.stepRow}>
              <View style={styles.stepLeft}>
                <View
                  style={[
                    styles.stepCircle,
                    step.done && styles.stepCircleDone,
                  ]}
                >
                  {step.done ? (
                    <LinearGradient
                      colors={["#8B5CF6", "#7C3AED"]}
                      style={styles.stepCircleGrad}
                    >
                      <Text style={styles.stepCheck}>✓</Text>
                    </LinearGradient>
                  ) : (
                    <Text style={styles.stepCircleEmpty} />
                  )}
                </View>
                {index < steps.length - 1 && (
                  <View
                    style={[styles.stepLine, step.done && styles.stepLineDone]}
                  />
                )}
              </View>
              <View style={styles.stepContent}>
                <Text
                  style={[styles.stepLabel, step.done && styles.stepLabelDone]}
                >
                  {step.label}
                </Text>
                <Text style={styles.stepSub}>{step.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          {[
            { label: "Red Floral Dress", value: "Rs. 2,500" },
            { label: "Wedding Sherwani (Rent)", value: "Rs. 1,500" },
            { label: "Delivery Fee", value: "Rs. 49" },
          ].map((item) => (
            <View key={item.label} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={styles.summaryValue}>{item.value}</Text>
            </View>
          ))}
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotal}>Total</Text>
            <Text style={styles.summaryTotalValue}>Rs. 4,049</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.trackBtn}
          onPress={() => router.push("/delivery")}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={["#8B5CF6", "#7C3AED"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.trackBtnGrad}
          >
            <Text style={styles.trackBtnText}>Track Delivery</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => router.push("/home")}
        >
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0B" },
  scroll: { paddingHorizontal: 20, paddingTop: 64 },
  successBox: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.2)",
  },
  successGrad: { padding: 32, alignItems: "center" },
  successIcon: { marginBottom: 16 },
  successIconGrad: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  successCheck: { color: "#fff", fontSize: 32, fontWeight: "900" },
  successTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 8,
  },
  successSub: { fontSize: 14, color: "#A1A1AA", textAlign: "center" },
  orderIdCard: {
    backgroundColor: "#111113",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.15)",
  },
  orderIdLabel: { fontSize: 12, color: "#52525B", marginRight: 8 },
  orderIdValue: { fontSize: 15, fontWeight: "800", color: "#fff", flex: 1 },
  orderIdBadge: {
    backgroundColor: "rgba(16,185,129,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.2)",
  },
  orderIdBadgeText: { color: "#10B981", fontSize: 11, fontWeight: "700" },
  trackingCard: {
    backgroundColor: "#111113",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.12)",
  },
  trackingTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 20,
  },
  stepRow: { flexDirection: "row", gap: 16 },
  stepLeft: { alignItems: "center", width: 32 },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1A1A1F",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.15)",
  },
  stepCircleDone: { borderColor: "#8B5CF6" },
  stepCircleGrad: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  stepCheck: { color: "#fff", fontSize: 14, fontWeight: "900" },
  stepCircleEmpty: { flex: 1 },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#1A1A1F",
    marginVertical: 4,
    minHeight: 28,
  },
  stepLineDone: { backgroundColor: "#8B5CF6" },
  stepContent: { flex: 1, paddingBottom: 24 },
  stepLabel: { fontSize: 14, fontWeight: "700", color: "#52525B" },
  stepLabelDone: { color: "#fff" },
  stepSub: { fontSize: 12, color: "#52525B", marginTop: 3 },
  summaryCard: {
    backgroundColor: "#111113",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.12)",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: { fontSize: 14, color: "#A1A1AA" },
  summaryValue: { fontSize: 14, color: "#fff", fontWeight: "600" },
  summaryDivider: {
    height: 1,
    backgroundColor: "rgba(139,92,246,0.12)",
    marginVertical: 10,
  },
  summaryTotal: { fontSize: 16, fontWeight: "800", color: "#fff" },
  summaryTotalValue: { fontSize: 18, fontWeight: "900", color: "#8B5CF6" },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 36,
    backgroundColor: "#0A0A0B",
    borderTopWidth: 1,
    borderTopColor: "rgba(139,92,246,0.12)",
    gap: 12,
  },
  trackBtn: { borderRadius: 16, overflow: "hidden" },
  trackBtnGrad: { padding: 17, alignItems: "center" },
  trackBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  homeBtn: { padding: 14, alignItems: "center" },
  homeBtnText: { color: "#A1A1AA", fontSize: 15, fontWeight: "600" },
});
