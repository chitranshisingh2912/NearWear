import { C } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Hero image */}
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        }}
        style={styles.backgroundImage}
      />

      {/* Gradient overlay — light, goes from transparent to bg */}
      <LinearGradient
        colors={[
          "transparent",
          "rgba(255,245,247,0.7)",
          "rgba(255,245,247,0.97)",
          C.bg,
        ]}
        style={styles.gradient}
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Top badge */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✨ DISCOVER LOCAL FASHION</Text>
          </View>
        </View>

        {/* Main copy */}
        <Animated.View
          style={[styles.main, { transform: [{ translateY: slideAnim }] }]}
        >
          <Text style={styles.title}>Shop Local,</Text>
          <Text style={styles.titleHighlight}>Dress Global</Text>
          <Text style={styles.subtitle}>
            Connect with the best local boutiques in your city. Discover unique
            styles, rent premium outfits, and get them delivered fast.
          </Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            {[
              { num: "500+", label: "Local Shops" },
              { num: "10K+", label: "Products" },
              { num: "50+", label: "Cities" },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <View style={styles.statDivider} />}
                <View style={styles.stat}>
                  <Text style={styles.statNum}>{s.num}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </Animated.View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push("/signup")}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={[C.primary, C.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btnGradient}
            >
              <Text style={styles.primaryBtnText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ghostBtn}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.ghostBtnText}>I already have an account</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.52,
    width,
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.68,
  },

  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  header: { alignItems: "flex-start", paddingTop: 64 },
  badge: {
    backgroundColor: C.primarySoft,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: C.border,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: C.primary,
    letterSpacing: 1,
  },

  main: { flex: 1, justifyContent: "flex-end", paddingBottom: 28 },
  title: { fontSize: 46, fontWeight: "900", color: C.text, lineHeight: 52 },
  titleHighlight: {
    fontSize: 46,
    fontWeight: "900",
    color: C.primary,
    lineHeight: 52,
    marginBottom: 14,
  },
  subtitle: {
    fontSize: 15,
    color: C.textSec,
    lineHeight: 24,
    marginBottom: 24,
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  stat: { flex: 1, alignItems: "center" },
  statNum: { fontSize: 20, fontWeight: "900", color: C.primary },
  statLabel: {
    fontSize: 11,
    color: C.textMuted,
    fontWeight: "500",
    marginTop: 2,
  },
  statDivider: { width: 1, height: 36, backgroundColor: C.border },

  buttons: { gap: 12, paddingBottom: 48 },

  primaryBtn: { borderRadius: 16, overflow: "hidden" },
  btnGradient: { padding: 17, alignItems: "center", borderRadius: 16 },
  primaryBtnText: {
    color: C.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  ghostBtn: { padding: 17, alignItems: "center" },
  ghostBtnText: { color: C.textSec, fontSize: 15, fontWeight: "500" },
});
