import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Auth screens - NO tabs */}
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="welcome" />

        {/* Tab group - shows bottom tabs */}
        <Stack.Screen name="(tabs)" />

        {/* Other screens outside tabs */}
        <Stack.Screen name="shopdetail" />
        <Stack.Screen name="productdetail" />
        <Stack.Screen name="shopowner" />
        <Stack.Screen name="virtual-tryon" />
        <Stack.Screen name="aiupload" />
        <Stack.Screen name="delivery" />
        <Stack.Screen name="orderconfirm" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="modal" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
