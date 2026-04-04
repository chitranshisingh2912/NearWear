import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const steps = [
  { label: "Order Confirmed", time: "2:15 PM", done: true },
  { label: "Shop Preparing", time: "2:20 PM", done: true },
  { label: "Rider Picked Up", time: "2:35 PM", done: true },
  { label: "Out for Delivery", time: "2:40 PM", done: false },
  { label: "Delivered", time: "Est. 3:00 PM", done: false },
];

export default function DeliveryScreen() {
  const router = useRouter();
  const [eta, setEta] = useState(20);
  const [simulated, setSimulated] = useState(false);

  const simulate = () => {
    setEta(5);
    setSimulated(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Track Delivery</Text>
        </View>

        {/* Map Placeholder */}
        <View style={styles.mapBox}>
          <LinearGradient
            colors={["#111113", "#1A1A1F"]}
            style={styles.mapGrad}
          >
            <View style={styles.mapCenter}>
              <LinearGradient
                colors={["#8B5CF6", "#7C3AED"]}
                style={styles.mapPin}
              >
                <Text style={styles.mapPinText}>📍</Text>
              </LinearGradient>
              <Text style={styles.mapText}>Live Map</Text>
              <Text style={styles.mapSub}>Rider is 1.2 km away</Text>
            </View>
          </LinearGradient>
        </View>

        {/* ETA Card */}
        <LinearGradient colors={["#8B5CF6", "#7C3AED"]} style={styles.etaCard}>
          <View style={styles.etaLeft}>
            <Text style={styles.etaNum}>{eta}</Text>
            <Text style={styles.etaLabel}>mins away</Text>
          </View>
          <View style={styles.etaDivider} />
          <View style={styles.etaRight}>
            <Text style={styles.etaStatus}>
              {simulated ? "Almost there!" : "On the way"}
            </Text>
            <Text style={styles.etaOrder}>Order #NW-2024-001</Text>
          </View>
        </LinearGradient>

        {/* Rider Info */}
        <View style={styles.riderCard}>
          <LinearGradient
            colors={["#8B5CF6", "#7C3AED"]}
            style={styles.riderAvatar}
          >
            <Text style={styles.riderAvatarText}>R</Text>
          </LinearGradient>
          <View style={styles.riderInfo}>
            <Text style={styles.riderName}>Rahul Kumar</Text>
            <Text style={styles.riderSub}>Your delivery rider · ★ 4.9</Text>
          </View>
          <TouchableOpacity style={styles.callBtn}>
            <LinearGradient
              colors={["rgba(139,92,246,0.2)", "rgba(124,58,237,0.2)"]}
              style={styles.callBtnGrad}
            >
              <Text style={styles.callBtnText}>Call</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Progress Steps */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Delivery Progress</Text>
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
                  ) : null}
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
                <Text style={styles.stepTime}>{step.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {!simulated && (
          <TouchableOpacity style={styles.simulateBtn} onPress={simulate}>
            <Text style={styles.simulateBtnText}>
              Simulate Delivery Progress
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0B" },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 64,
    paddingBottom: 24,
    gap: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#111113",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.15)",
  },
  backIcon: { color: "#fff", fontSize: 20, fontWeight: "600" },
  title: { fontSize: 24, fontWeight: "900", color: "#fff" },
  mapBox: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.15)",
  },
  mapGrad: { height: 200, alignItems: "center", justifyContent: "center" },
  mapCenter: { alignItems: "center" },
  mapPin: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  mapPinText: { fontSize: 24 },
  mapText: { fontSize: 16, fontWeight: "800", color: "#fff", marginBottom: 4 },
  mapSub: { fontSize: 13, color: "#A1A1AA" },
  etaCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  etaLeft: { alignItems: "center", paddingRight: 20 },
  etaNum: { fontSize: 48, fontWeight: "900", color: "#fff", lineHeight: 52 },
  etaLabel: { fontSize: 13, color: "rgba(255,255,255,0.8)" },
  etaDivider: {
    width: 1,
    height: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  etaRight: { flex: 1, paddingLeft: 20 },
  etaStatus: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  etaOrder: { fontSize: 13, color: "rgba(255,255,255,0.7)" },
  riderCard: {
    backgroundColor: "#111113",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.12)",
  },
  riderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  riderAvatarText: { color: "#fff", fontWeight: "900", fontSize: 20 },
  riderInfo: { flex: 1, marginLeft: 14 },
  riderName: { fontSize: 16, fontWeight: "700", color: "#fff" },
  riderSub: { fontSize: 12, color: "#52525B", marginTop: 2 },
  callBtn: { borderRadius: 12, overflow: "hidden" },
  callBtnGrad: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.3)",
  },
  callBtnText: { color: "#8B5CF6", fontWeight: "700", fontSize: 14 },
  progressCard: {
    backgroundColor: "#111113",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.12)",
  },
  progressTitle: {
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
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#1A1A1F",
    marginVertical: 4,
    minHeight: 24,
  },
  stepLineDone: { backgroundColor: "#8B5CF6" },
  stepContent: { flex: 1, paddingBottom: 20 },
  stepLabel: { fontSize: 14, fontWeight: "700", color: "#52525B" },
  stepLabelDone: { color: "#fff" },
  stepTime: { fontSize: 12, color: "#52525B", marginTop: 2 },
  simulateBtn: {
    backgroundColor: "#111113",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.2)",
  },
  simulateBtnText: { color: "#8B5CF6", fontWeight: "700", fontSize: 14 },
});
