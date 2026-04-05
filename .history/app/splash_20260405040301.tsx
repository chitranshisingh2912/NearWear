import { C } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => router.replace("/welcome"), 2600);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Soft blush background circles */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Logo box */}
        <LinearGradient
          colors={[C.primary, C.primaryDark]}
          style={styles.logoBox}
        >
          <Text style={styles.logoText}>N</Text>
        </LinearGradient>

        <Animated.View
          style={{ transform: [{ translateY: slideAnim }], opacity: fadeAnim }}
        >
          <Text style={styles.appName}>NearWear</Text>
          <Text style={styles.tagline}>LOCAL FASHION. REAL STYLE.</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  circle1: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: C.primary,
    opacity: 0.08,
    top: -100,
    right: -100,
  },
  circle2: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: C.primaryLight,
    opacity: 0.1,
    bottom: 80,
    left: -80,
  },
  circle3: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: C.primaryDark,
    opacity: 0.06,
    bottom: -40,
    right: 40,
  },
  content: { alignItems: "center" },
  logoBox: {
    width: 100,
    height: 100,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 20,
  },
  logoText: { fontSize: 52, fontWeight: "900", color: C.white },
  appName: {
    fontSize: 44,
    fontWeight: "900",
    color: C.text,
    textAlign: "center",
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 12,
    color: C.textMuted,
    textAlign: "center",
    marginTop: 10,
    letterSpacing: 4,
  },
});
