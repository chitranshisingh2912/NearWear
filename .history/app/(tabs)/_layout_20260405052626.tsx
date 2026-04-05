import { C } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

type IoniconName = keyof typeof Ionicons.glyphMap;

function TabIcon({ name, focused }: { name: IoniconName; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons
        name={name}
        size={22}
        color={focused ? C.primary : C.textMuted}
      />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: C.primary,
        tabBarInactiveTintColor: C.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "home" : "home-outline"}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? "map" : "map-outline"} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="aistylist"
        options={{
          title: "AI",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "sparkles" : "sparkles-outline"}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? "bag" : "bag-outline"} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "person" : "person-outline"}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: C.card,
    borderTopWidth: 1,
    borderTopColor: C.border,
    height: Platform.OS === "ios" ? 88 : 68,
    paddingBottom: Platform.OS === "ios" ? 28 : 10,
    paddingTop: 8,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 16,
  },
  tabLabel: { fontSize: 11, fontWeight: "600", marginTop: 2 },
  iconWrap: {
    width: 42,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  iconWrapActive: { backgroundColor: C.primarySoft },
});
