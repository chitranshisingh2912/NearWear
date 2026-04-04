import { C } from "@/constants/theme";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

interface Props extends ViewProps {
  type?: "default" | "card" | "surface" | "row";
}

export function ThemedView({
  style,
  type = "default",
  children,
  ...rest
}: Props) {
  return (
    <View style={[styles[type], style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  default: { backgroundColor: C.bg },
  card: {
    backgroundColor: C.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  surface: { backgroundColor: C.surface, borderRadius: 12 },
  row: { flexDirection: "row", alignItems: "center" },
});
