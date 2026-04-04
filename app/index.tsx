import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { auth } from "../firebaseConfig";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/(tabs)/home" as any);
      } else {
        router.replace("/login" as any);
      }
    });
    return () => unsub();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF0F3",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator color="#D4437C" size="large" />
    </View>
  );
}
