import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login" as any);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator color="#D4437C" size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF0F3",
    alignItems: "center",
    justifyContent: "center",
  },
});
