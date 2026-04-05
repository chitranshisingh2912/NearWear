import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { auth } from "./firebaseConfig";

const { width, height } = Dimensions.get("window");

const C = {
  bg: "#FFFFFF",
  primary: "#D4437C",
  primaryDeep: "#B5305F",
  surface: "#FFF5F8",
  border: "rgba(212,67,124,0.14)",
  borderFocus: "rgba(212,67,124,0.65)",
  text: "#1A1A2E",
  textSec: "#6B6B8A",
  textMuted: "#BEB0C8",
  error: "#EF4444",
  white: "#FFFFFF",
};

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(48)).current;

  useEffect(() => {
    // Just animate in - NO AUTH CHECK
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }),
      Animated.spring(slide, {
        toValue: 0,
        tension: 55,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/(tabs)/home");
    } catch (err: any) {
      const map: Record<string, string> = {
        "auth/user-not-found": "No account found with this email",
        "auth/wrong-password": "Incorrect password. Try again",
        "auth/invalid-email": "Please enter a valid email",
        "auth/too-many-requests": "Too many attempts. Please wait",
        "auth/invalid-credential": "Invalid email or password",
        "auth/network-request-failed": "Network error. Check connection",
      };
      setError(map[err.code] || `Login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.root}>
      <View
        style={[
          s.blob,
          {
            width: 300,
            height: 300,
            top: -90,
            right: -90,
            backgroundColor: "rgba(255,172,210,0.28)",
          },
        ]}
      />
      <View
        style={[
          s.blob,
          {
            width: 220,
            height: 220,
            top: 220,
            left: -80,
            backgroundColor: "rgba(212,67,124,0.09)",
          },
        ]}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={{ opacity: fade, transform: [{ translateY: slide }] }}
          >
            <View style={s.logoBlock}>
              <LinearGradient
                colors={["#FF85B8", "#D4437C", "#B5305F"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.logoGrad}
              >
                <Text style={s.logoN}>N</Text>
              </LinearGradient>
              <Text style={s.brandLabel}>NEARWEAR</Text>
              <Text style={s.heading}>Welcome Back 👋</Text>
            </View>

            {!!error && (
              <View style={s.errorBox}>
                <Text style={{ fontSize: 15 }}>⚠️</Text>
                <Text style={s.errorTxt}>{error}</Text>
              </View>
            )}

            <View style={s.card}>
              <View style={s.fieldWrap}>
                <Text style={s.fieldLabel}>Email</Text>
                <View
                  style={[s.inputBox, focused === "email" && s.inputFocused]}
                >
                  <TextInput
                    style={s.inputTxt}
                    placeholder="you@example.com"
                    placeholderTextColor={C.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                  />
                </View>
              </View>

              <View style={s.fieldWrap}>
                <Text style={s.fieldLabel}>Password</Text>
                <View
                  style={[s.inputBox, focused === "pass" && s.inputFocused]}
                >
                  <TextInput
                    style={[s.inputTxt, { flex: 1 }]}
                    placeholder="Enter password"
                    placeholderTextColor={C.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPass}
                    onFocus={() => setFocused("pass")}
                    onBlur={() => setFocused(null)}
                  />
                  <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                    <Text style={s.showHide}>{showPass ? "Hide" : "Show"}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={s.signInBtn}
                onPress={handleLogin}
                disabled={loading}
              >
                <LinearGradient
                  colors={["#E8558A", "#D4437C", "#C0255E"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={s.signInGrad}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={s.signInLabel}>Sign In ✦</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View style={s.footer}>
                <Text style={s.footerTxt}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/signup")}>
                  <Text style={s.footerLink}>Sign Up ✨</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  blob: { position: "absolute", borderRadius: 999 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60 },
  logoBlock: { alignItems: "center", marginBottom: 26 },
  logoGrad: {
    width: 88,
    height: 88,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoN: { fontSize: 40, fontWeight: "900", color: "#fff" },
  brandLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: C.primary,
    letterSpacing: 4,
    marginBottom: 12,
  },
  heading: { fontSize: 30, fontWeight: "900", color: C.text, marginBottom: 8 },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(239,68,68,0.07)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.20)",
  },
  errorTxt: { flex: 1, color: C.error, fontSize: 13, fontWeight: "600" },
  card: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: C.border,
  },
  fieldWrap: { marginBottom: 18 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: C.textSec,
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F8",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.border,
    paddingHorizontal: 14,
    minHeight: 56,
  },
  inputFocused: { borderColor: C.primary, backgroundColor: "#FFF0F5" },
  inputTxt: { flex: 1, fontSize: 15, color: C.text, paddingVertical: 14 },
  showHide: {
    color: C.primary,
    fontSize: 13,
    fontWeight: "700",
    paddingLeft: 8,
  },
  signInBtn: {
    borderRadius: 18,
    overflow: "hidden",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(212,67,124,0.28)",
  },
  signInGrad: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  signInLabel: { color: "#fff", fontSize: 17, fontWeight: "800" },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerTxt: { color: C.textSec, fontSize: 14 },
  footerLink: { color: C.primary, fontSize: 14, fontWeight: "800" },
});
