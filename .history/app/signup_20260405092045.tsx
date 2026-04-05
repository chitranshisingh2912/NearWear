import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// LOCAL FIREBASE CONFIG - NO IMPORT NEEDED
const firebaseConfig = {
  apiKey: "AIzaSyAIwiTEnomwZoNaAd8X_xksN7AepWH64qI",
  authDomain: "nearwear-8fc71.firebaseapp.com",
  projectId: "nearwear-8fc71",
  storageBucket: "nearwear-8fc71.firebasestorage.app",
  messagingSenderId: "658283130251",
  appId: "1:658283130251:web:a6a67638a3cd2eee51938e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// LOCAL COLORS
const C = {
  bg: "#FFF0F3",
  card: "#FFFFFF",
  surface: "#FFE4EC",
  border: "rgba(212,67,124,0.18)",
  borderLight: "rgba(212,67,124,0.10)",
  primary: "#D4437C",
  primaryDark: "#B8326E",
  primarySoft: "rgba(212,67,124,0.10)",
  text: "#1A1A2E",
  textSec: "#5A5A7A",
  textMuted: "#9E9EBE",
  white: "#FFFFFF",
  error: "#EF4444",
  inputBg: "#FFFFFF",
  inputBorder: "rgba(212,67,124,0.25)",
  shadow: "rgba(212,67,124,0.08)",
};

type Role = "customer" | "shop_owner";

export default function SignupScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        name,
        email,
        phone,
        role,
        createdAt: new Date(),
      });
      router.push("/(tabs)/home");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use")
        setError("Email already registered");
      else setError("Signup failed. Please try again");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Header row */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => (step === 2 ? setStep(1) : router.back())}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>

            {/* Step indicator */}
            <View style={styles.stepRow}>
              <View style={[styles.stepDot, styles.stepDotActive]} />
              <View
                style={[styles.stepLine, step === 2 && styles.stepLineActive]}
              />
              <View
                style={[styles.stepDot, step === 2 && styles.stepDotActive]}
              />
            </View>
            <View style={{ width: 44 }} />
          </View>

          {/* ── STEP 1 : Choose Role ── */}
          {step === 1 && (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Join NearWear 🛍️</Text>
                <Text style={styles.subtitle}>
                  Choose how you want to use NearWear
                </Text>
              </View>

              <View style={styles.rolesContainer}>
                {[
                  {
                    key: "customer" as Role,
                    emoji: "🛍️",
                    title: "Customer",
                    desc: "Browse shops, discover fashion, and shop from local boutiques",
                    features: [
                      "Shop local stores",
                      "Rent premium wear",
                      "AI style suggestions",
                    ],
                  },
                  {
                    key: "shop_owner" as Role,
                    emoji: "🏪",
                    title: "Shop Owner",
                    desc: "List your store, manage products, and reach local customers",
                    features: [
                      "List your shop",
                      "Manage inventory",
                      "Track orders",
                    ],
                  },
                ].map((r) => (
                  <TouchableOpacity
                    key={r.key}
                    style={[
                      styles.roleCard,
                      role === r.key && styles.roleCardActive,
                    ]}
                    onPress={() => setRole(r.key)}
                    activeOpacity={0.85}
                  >
                    {role === r.key && (
                      <LinearGradient
                        colors={[C.primary, C.primaryDark]}
                        style={StyleSheet.absoluteFill}
                      />
                    )}
                    <View style={styles.roleContent}>
                      <View
                        style={[
                          styles.roleIconBox,
                          role === r.key && styles.roleIconBoxActive,
                        ]}
                      >
                        <Text style={styles.roleIcon}>{r.emoji}</Text>
                      </View>
                      <Text style={styles.roleTitle}>{r.title}</Text>
                      <Text
                        style={[
                          styles.roleDesc,
                          role === r.key && { color: "rgba(255,255,255,0.85)" },
                        ]}
                      >
                        {r.desc}
                      </Text>
                      <View style={styles.roleFeatures}>
                        {r.features.map((f) => (
                          <View key={f} style={styles.featureRow}>
                            <Text
                              style={[
                                styles.checkmark,
                                role === r.key && { color: C.white },
                              ]}
                            >
                              ✓
                            </Text>
                            <Text
                              style={[
                                styles.featureText,
                                role === r.key && {
                                  color: "rgba(255,255,255,0.9)",
                                },
                              ]}
                            >
                              {f}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.continueBtn, !role && { opacity: 0.4 }]}
                onPress={() => role && setStep(2)}
                disabled={!role}
              >
                <LinearGradient
                  colors={[C.primary, C.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.btnGradient}
                >
                  <Text style={styles.continueBtnText}>Continue →</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          {/* ── STEP 2 : Fill Details ── */}
          {step === 2 && (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>
                  {role === "customer"
                    ? "Start shopping local fashion"
                    : "Register your shop"}
                </Text>
              </View>

              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>⚠️ {error}</Text>
                </View>
              ) : null}

              {[
                {
                  label: "Full Name",
                  value: name,
                  setter: setName,
                  placeholder: "Your full name",
                  keyboard: "default",
                },
                {
                  label: "Email Address",
                  value: email,
                  setter: setEmail,
                  placeholder: "you@example.com",
                  keyboard: "email-address",
                },
                {
                  label: "Phone Number",
                  value: phone,
                  setter: setPhone,
                  placeholder: "+91 XXXXXXXXXX",
                  keyboard: "phone-pad",
                },
              ].map((field) => (
                <View key={field.label} style={styles.inputGroup}>
                  <Text style={styles.label}>{field.label}</Text>
                  <View style={styles.inputBox}>
                    <TextInput
                      style={styles.input}
                      placeholder={field.placeholder}
                      placeholderTextColor={C.textMuted}
                      value={field.value}
                      onChangeText={field.setter}
                      keyboardType={field.keyboard as any}
                      autoCapitalize="none"
                    />
                  </View>
                </View>
              ))}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Create a password"
                    placeholderTextColor={C.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPass}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPass(!showPass)}
                    style={styles.eyeBtn}
                  >
                    <Text style={styles.eyeText}>
                      {showPass ? "Hide" : "Show"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.terms}>
                By signing up, you agree to our{" "}
                <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>

              <TouchableOpacity
                style={styles.continueBtn}
                onPress={handleSignup}
                disabled={loading}
              >
                <LinearGradient
                  colors={[C.primary, C.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.btnGradient}
                >
                  {loading ? (
                    <ActivityIndicator color={C.white} />
                  ) : (
                    <Text style={styles.continueBtnText}>Create Account</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.footerLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 60,
    marginBottom: 32,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: { color: C.text, fontSize: 20, fontWeight: "600" },

  stepRow: { flexDirection: "row", alignItems: "center" },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.border,
  },
  stepDotActive: { backgroundColor: C.primary },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: C.border,
    marginHorizontal: 4,
  },
  stepLineActive: { backgroundColor: C.primary },

  header: { marginBottom: 28 },
  title: { fontSize: 30, fontWeight: "900", color: C.text, marginBottom: 8 },
  subtitle: { fontSize: 15, color: C.textSec },

  rolesContainer: { gap: 16, marginBottom: 28 },
  roleCard: {
    borderRadius: 20,
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: C.border,
    overflow: "hidden",
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  roleCardActive: { borderColor: C.primary },
  roleContent: { padding: 24 },
  roleIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: C.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  roleIconBoxActive: { backgroundColor: "rgba(255,255,255,0.2)" },
  roleIcon: { fontSize: 26 },
  roleTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: C.text,
    marginBottom: 8,
  },
  roleDesc: {
    fontSize: 13,
    color: C.textSec,
    lineHeight: 20,
    marginBottom: 14,
  },

  roleFeatures: { gap: 8 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  checkmark: { color: C.primary, fontWeight: "700", fontSize: 14 },
  featureText: { fontSize: 13, color: C.textSec },

  errorBox: {
    backgroundColor: "rgba(229,57,53,0.08)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(229,57,53,0.25)",
  },
  errorText: { color: C.error, fontSize: 13, textAlign: "center" },

  inputGroup: { marginBottom: 16 },
  label: { color: C.textSec, fontSize: 13, fontWeight: "600", marginBottom: 8 },
  inputBox: {
    backgroundColor: C.inputBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.inputBorder,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  input: { color: C.text, fontSize: 15, paddingVertical: 16, flex: 1 },
  eyeBtn: { padding: 8 },
  eyeText: { color: C.primary, fontSize: 13, fontWeight: "600" },

  terms: {
    fontSize: 12,
    color: C.textMuted,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  termsLink: { color: C.primary, fontWeight: "600" },

  continueBtn: { borderRadius: 16, overflow: "hidden", marginBottom: 12 },
  btnGradient: { padding: 17, alignItems: "center" },
  continueBtnText: {
    color: C.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { color: C.textSec, fontSize: 14 },
  footerLink: { color: C.primary, fontSize: 14, fontWeight: "700" },
});
