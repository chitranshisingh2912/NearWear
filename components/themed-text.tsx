import { C } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";

interface Props extends TextProps {
  type?: "display" | "title" | "subtitle" | "body" | "caption" | "muted";
}

export function ThemedText({ style, type = "body", children, ...rest }: Props) {
  return (
    <Text style={[styles.base, styles[type], style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: { color: C.text },
  display: {
    fontSize: 34,
    fontWeight: "900",
    color: C.text,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: C.text,
    letterSpacing: -0.3,
  },
  subtitle: { fontSize: 18, fontWeight: "700", color: C.text },
  body: { fontSize: 15, fontWeight: "400", color: C.text, lineHeight: 22 },
  caption: {
    fontSize: 13,
    fontWeight: "400",
    color: C.textSec,
    lineHeight: 18,
  },
  muted: { fontSize: 12, fontWeight: "400", color: C.textMuted },
});
