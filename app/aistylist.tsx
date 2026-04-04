// app/stylesync.tsx – StyleSync AI Feature – Pink theme (matches NearWear codebase)
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const GROQ_API_KEY = "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";

// ── Color tokens (matches aistylist.tsx) ──────────────────────────────────────
const C = {
  bg: "#FFF0F3",
  card: "#FFFFFF",
  surface: "#FFE4EC",
  border: "rgba(212,67,124,0.18)",
  borderLight: "rgba(212,67,124,0.10)",
  primary: "#D4437C",
  primarySoft: "rgba(212,67,124,0.10)",
  text: "#1A1A2E",
  textSec: "#5A5A7A",
  textMuted: "#9E9EBE",
  error: "#EF4444",
  success: "#10B981",
  white: "#FFFFFF",
  gold: "#C9A84C",
  goldSoft: "rgba(201,168,76,0.12)",
};

// ── Static data ───────────────────────────────────────────────────────────────
const availableShops = [
  {
    name: "Ethnic Elegance",
    specialty: "Wedding, Traditional",
    rating: 4.8,
    category: "Female Wear",
  },
  {
    name: "Chanderi Silk House",
    specialty: "Silk sarees, GI tagged",
    rating: 4.9,
    category: "Female Wear",
  },
  {
    name: "Men's Empire",
    specialty: "Formal, Casual menswear",
    rating: 4.5,
    category: "Male Wear",
  },
  {
    name: "Fashion Hub",
    specialty: "Trendy, Bulk orders",
    rating: 4.2,
    category: "Both",
  },
  {
    name: "Maheshwari Textiles",
    specialty: "Historical, Traditional",
    rating: 4.7,
    category: "Both",
  },
  {
    name: "Trend Setters",
    specialty: "Party wear, Modern",
    rating: 4.4,
    category: "Female Wear",
  },
];

const OCCASIONS = [
  "Wedding",
  "Casual Day",
  "Office",
  "Party Night",
  "College",
  "Festival",
  "Date Night",
];
const BUDGETS = ["Under ₹2,000", "₹2,000–₹5,000", "₹5,000–₹15,000", "₹15,000+"];
const STYLES = [
  "Ethnic / Traditional",
  "Modern / Western",
  "Fusion",
  "Boho",
  "Minimalist",
];
const GENDERS = ["Female", "Male", "Unisex"];
const SEASONS = ["Summer", "Monsoon", "Winter", "Spring"];

// ── Types ─────────────────────────────────────────────────────────────────────
type LookCard = {
  tier: "budget" | "trendy" | "premium";
  label: string;
  emoji: string;
  outfit: string;
  footwear: string;
  accessories: string;
  colors: string[];
  priceRange: string;
  shops: string[];
};

type StyleSyncResult = {
  detected_item: string;
  style_category: string;
  primary_colors: string[];
  suggested_palette: string[];
  looks: LookCard[];
  battle: {
    traditional: { title: string; description: string; items: string[] };
    trendy: { title: string; description: string; items: string[] };
  };
};

// ── Filter chip selector ───────────────────────────────────────────────────────
function FilterRow({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <View style={s.filterBlock}>
      <Text style={s.filterLabel}>{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filterScroll}
      >
        {options.map((opt) => {
          const active = selected === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[s.filterChip, active && s.filterChipActive]}
              onPress={() => onSelect(opt)}
            >
              <Text
                style={[s.filterChipText, active && s.filterChipTextActive]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ── Look card ─────────────────────────────────────────────────────────────────
function LookCardView({
  look,
  onFindShops,
}: {
  look: LookCard;
  onFindShops: () => void;
}) {
  const tierBg: Record<LookCard["tier"], string> = {
    budget: "#F0FFF8",
    trendy: "#FFF0F5",
    premium: "#1A1A2E",
  };
  const tierBadgeBg: Record<LookCard["tier"], string> = {
    budget: "rgba(16,185,129,0.12)",
    trendy: C.primarySoft,
    premium: "rgba(201,168,76,0.18)",
  };
  const tierBadgeText: Record<LookCard["tier"], string> = {
    budget: C.success,
    trendy: C.primary,
    premium: C.gold,
  };
  const isPremium = look.tier === "premium";

  return (
    <View style={[s.lookCard, { backgroundColor: tierBg[look.tier] }]}>
      {/* Header */}
      <View style={s.lookCardHeader}>
        <Text style={[s.lookEmoji]}>{look.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[s.lookTitle, isPremium && { color: C.white }]}>
            {look.label}
          </Text>
          <View
            style={[s.tierBadge, { backgroundColor: tierBadgeBg[look.tier] }]}
          >
            <Text
              style={[s.tierBadgeText, { color: tierBadgeText[look.tier] }]}
            >
              {look.tier === "budget"
                ? "💚 Budget Friendly"
                : look.tier === "trendy"
                  ? "🩷 Trendy Pick"
                  : "👑 Premium"}
            </Text>
          </View>
        </View>
        <Text style={[s.lookPrice, isPremium && { color: C.gold }]}>
          {look.priceRange}
        </Text>
      </View>

      {/* Details grid */}
      <View style={s.lookGrid}>
        <DetailCell label="👗 Outfit" value={look.outfit} dark={isPremium} />
        <DetailCell
          label="👠 Footwear"
          value={look.footwear}
          dark={isPremium}
        />
        <DetailCell
          label="💍 Accessories"
          value={look.accessories}
          dark={isPremium}
        />
        <View style={s.detailCell}>
          <Text
            style={[
              s.detailCellLabel,
              isPremium && { color: "rgba(255,255,255,0.5)" },
            ]}
          >
            🎨 Colors
          </Text>
          <View style={s.colorsRow}>
            {look.colors.map((c, i) => (
              <View key={i} style={s.colorPill}>
                <Text style={s.colorPillText}>{c}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Shops */}
      <View style={s.shopsRow}>
        <Text
          style={[
            s.shopsLabel,
            isPremium && { color: "rgba(255,255,255,0.5)" },
          ]}
        >
          🏪 Find at:
        </Text>
        <Text style={[s.shopsValue, isPremium && { color: C.gold }]}>
          {look.shops.join(", ")}
        </Text>
      </View>

      {/* CTA */}
      <TouchableOpacity style={s.findBtn} onPress={onFindShops}>
        {isPremium ? (
          <LinearGradient
            colors={[C.gold, "#E8C060"]}
            style={s.findBtnGradient}
          >
            <Text style={[s.findBtnText, { color: "#1A1A2E" }]}>
              Find in Local Shops →
            </Text>
          </LinearGradient>
        ) : (
          <LinearGradient
            colors={[C.primary, "#E91E8C"]}
            style={s.findBtnGradient}
          >
            <Text style={s.findBtnText}>Find in Local Shops →</Text>
          </LinearGradient>
        )}
      </TouchableOpacity>
    </View>
  );
}

function DetailCell({
  label,
  value,
  dark,
}: {
  label: string;
  value: string;
  dark?: boolean;
}) {
  return (
    <View style={s.detailCell}>
      <Text
        style={[s.detailCellLabel, dark && { color: "rgba(255,255,255,0.5)" }]}
      >
        {label}
      </Text>
      <Text style={[s.detailCellValue, dark && { color: C.white }]}>
        {value}
      </Text>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function StyleSyncScreen() {
  const router = useRouter();

  // Filters
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [budget, setBudget] = useState(BUDGETS[1]);
  const [style, setStyle] = useState(STYLES[0]);
  const [gender, setGender] = useState(GENDERS[0]);
  const [season, setSeason] = useState(SEASONS[0]);

  // Image
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StyleSyncResult | null>(null);
  const [battleChoice, setBattleChoice] = useState<
    "traditional" | "trendy" | null
  >(null);
  const [voted, setVoted] = useState(false);
  const [tradPct, setTradPct] = useState(54);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () =>
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

  // ── Pick image ──────────────────────────────────────────────────────────────
  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Please allow access to your photos.");
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
        base64: true,
      });
      if (!res.canceled && res.assets[0]) {
        setImageUri(res.assets[0].uri);
        setImageBase64(res.assets[0].base64 ?? null);
        setResult(null);
        fadeAnim.setValue(0);
      }
    } catch {
      setError("Failed to pick image.");
    }
  };

  // ── Run analysis ────────────────────────────────────────────────────────────
  const runAnalysis = async () => {
    if (!imageUri) {
      Alert.alert("No image", "Please upload a photo of your outfit first.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setBattleChoice(null);
    setVoted(false);
    fadeAnim.setValue(0);

    try {
      const shopNames = availableShops.map((s) => s.name).join(", ");

      const userContent: any[] = [
        {
          type: "text",
          text: `You are StyleSync AI, a fashion stylist for the NearWear local shopping app.

Analyze the outfit in this image and generate complete styled looks based on:
- Occasion: ${occasion}
- Budget preference: ${budget}
- Style: ${style}
- Gender: ${gender}
- Season: ${season}

Available local shops: ${shopNames}

Return ONLY valid JSON (no markdown, no code fences) in EXACTLY this format:
{
  "detected_item": "what is detected in the image (e.g. Floral cotton kurti)",
  "style_category": "style label (e.g. Ethnic casual)",
  "primary_colors": ["color1", "color2"],
  "suggested_palette": ["complementary color1", "complementary color2", "complementary color3", "complementary color4"],
  "looks": [
    {
      "tier": "budget",
      "label": "Budget Friendly Look",
      "emoji": "🌸",
      "outfit": "Full outfit description",
      "footwear": "Footwear recommendation",
      "accessories": "Accessories recommendation",
      "colors": ["color1", "color2"],
      "priceRange": "₹X – ₹Y",
      "shops": ["Shop Name 1", "Shop Name 2"]
    },
    {
      "tier": "trendy",
      "label": "Trendy Look",
      "emoji": "✨",
      "outfit": "Full outfit description",
      "footwear": "Footwear recommendation",
      "accessories": "Accessories recommendation",
      "colors": ["color1", "color2"],
      "priceRange": "₹X – ₹Y",
      "shops": ["Shop Name 1", "Shop Name 2"]
    },
    {
      "tier": "premium",
      "label": "Premium Look",
      "emoji": "👑",
      "outfit": "Full outfit description",
      "footwear": "Footwear recommendation",
      "accessories": "Accessories recommendation",
      "colors": ["color1", "color2"],
      "priceRange": "₹X – ₹Y",
      "shops": ["Shop Name 1"]
    }
  ],
  "battle": {
    "traditional": {
      "title": "Traditional Look",
      "description": "One-line description",
      "items": ["item1", "item2", "item3"]
    },
    "trendy": {
      "title": "Trendy Look",
      "description": "One-line description",
      "items": ["item1", "item2", "item3"]
    }
  }
}`,
        },
      ];

      if (imageBase64) {
        userContent.push({
          type: "image_url",
          image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
        });
      }

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-4-scout-17b-16e-instruct", // ✅ Updated: replaces deprecated llama-3.2-11b-vision-preview
            messages: [{ role: "user", content: userContent }],
            temperature: 0.7,
            max_tokens: 2048,
          }),
        },
      );

      if (!response.ok) {
        const e = await response.json();
        throw new Error(e.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error("Empty response from AI");

      const parsed: StyleSyncResult = JSON.parse(
        text.replace(/```json|```/g, "").trim(),
      );
      setResult(parsed);
      fadeIn();
    } catch (err: any) {
      setError(
        err.message || "AI analysis failed. Showing fallback suggestions.",
      );
      setResult(generateFallback());
      fadeIn();
    } finally {
      setLoading(false);
    }
  };

  // ── Fallback ────────────────────────────────────────────────────────────────
  const generateFallback = (): StyleSyncResult => ({
    detected_item: "Ethnic kurta set",
    style_category: style,
    primary_colors: ["Dusty rose", "Ivory"],
    suggested_palette: ["Mauve", "Sage green", "Gold", "Peach"],
    looks: [
      {
        tier: "budget",
        label: "Budget Friendly Look",
        emoji: "🌸",
        outfit: `Printed cotton kurti with palazzos — perfect for ${occasion}`,
        footwear: "Block heel kolhapuris",
        accessories: "Oxidised jhumkas & potli bag",
        colors: ["Dusty rose", "Off-white"],
        priceRange: "₹1,200 – ₹2,800",
        shops: ["Fashion Hub", "Trend Setters"],
      },
      {
        tier: "trendy",
        label: "Trendy Look",
        emoji: "✨",
        outfit: `Mirror work crop top with flared palazzo — ${season} ready`,
        footwear: "Embellished block sandals",
        accessories: "Layered necklace & tote bag",
        colors: ["Blush pink", "Gold accent"],
        priceRange: "₹3,500 – ₹7,500",
        shops: ["Trend Setters", "Ethnic Elegance"],
      },
      {
        tier: "premium",
        label: "Premium Look",
        emoji: "👑",
        outfit: "Chanderi silk anarkali with organza dupatta",
        footwear: "Hand-crafted mojaris",
        accessories: "Polki set & embroidered clutch",
        colors: ["Deep rose", "Ivory", "Zari gold"],
        priceRange: "₹12,000 – ₹28,000",
        shops: ["Chanderi Silk House", "Maheshwari Textiles"],
      },
    ],
    battle: {
      traditional: {
        title: "Traditional Look",
        description: "Timeless Indian elegance",
        items: ["Silk saree", "Gold jewellery", "Embroidered juttis"],
      },
      trendy: {
        title: "Trendy Look",
        description: "Bold & contemporary fusion",
        items: ["Indo-western co-ord", "Oxidised earrings", "Strappy heels"],
      },
    },
  });

  // ── Vote ────────────────────────────────────────────────────────────────────
  const castVote = () => {
    if (!battleChoice) {
      Alert.alert("Pick a look", "Tap a look card to choose before voting.");
      return;
    }
    if (voted) return;
    setVoted(true);
    setTradPct(
      battleChoice === "traditional"
        ? Math.min(tradPct + 8, 85)
        : Math.max(tradPct - 8, 15),
    );
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={s.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* ── Header ── */}
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Text style={s.backText}>←</Text>
          </TouchableOpacity>
          <View style={s.headerContent}>
            <LinearGradient
              colors={["#D4437C", "#E91E8C"]}
              style={s.headerIcon}
            >
              <Text style={s.headerIconText}>SS</Text>
            </LinearGradient>
            <View>
              <Text style={s.headerTitle}>StyleSync AI</Text>
              <Text style={s.headerSub}>Upload · Choose · Get styled</Text>
            </View>
          </View>
        </View>

        {/* ── Upload zone ── */}
        <View style={s.card}>
          <Text style={s.cardLabel}>Upload your outfit photo</Text>
          <TouchableOpacity
            style={[s.uploadZone, imageUri && s.uploadZoneActive]}
            onPress={pickImage}
          >
            {imageUri ? (
              <>
                <Image source={{ uri: imageUri }} style={s.uploadPreview} />
                <TouchableOpacity
                  style={s.removeBtn}
                  onPress={() => {
                    setImageUri(null);
                    setImageBase64(null);
                    setResult(null);
                  }}
                >
                  <Text style={s.removeBtnText}>✕</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={s.uploadPlaceholder}>
                <Text style={s.uploadPlaceholderIcon}>🌸</Text>
                <Text style={s.uploadPlaceholderText}>
                  Tap to upload your outfit
                </Text>
                <Text style={s.uploadPlaceholderHint}>
                  JPG or PNG · Any fashion photo
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Filters ── */}
        <View style={s.card}>
          <Text style={s.cardLabel}>Your preferences</Text>
          <FilterRow
            label="Occasion"
            options={OCCASIONS}
            selected={occasion}
            onSelect={setOccasion}
          />
          <FilterRow
            label="Budget"
            options={BUDGETS}
            selected={budget}
            onSelect={setBudget}
          />
          <FilterRow
            label="Style"
            options={STYLES}
            selected={style}
            onSelect={setStyle}
          />
          <FilterRow
            label="Gender"
            options={GENDERS}
            selected={gender}
            onSelect={setGender}
          />
          <FilterRow
            label="Season"
            options={SEASONS}
            selected={season}
            onSelect={setSeason}
          />
        </View>

        {/* ── Analyze button ── */}
        <TouchableOpacity
          style={s.analyzeBtn}
          onPress={runAnalysis}
          disabled={loading}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={loading ? ["#C0B0B5", "#B0A0A5"] : ["#D4437C", "#E91E8C"]}
            style={s.analyzeBtnGradient}
          >
            {loading ? (
              <ActivityIndicator color={C.white} />
            ) : (
              <Text style={s.analyzeBtnText}>✦ Sync My Style</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* ── Error ── */}
        {error && (
          <View style={s.errorBanner}>
            <Text style={s.errorText}>⚠️ {error}</Text>
            <Text style={s.errorSub}>Showing offline suggestions instead</Text>
          </View>
        )}

        {/* ── Results ── */}
        {result && (
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Detected outfit */}
            <View style={s.detectedCard}>
              <View style={s.detectedLeft}>
                <Text style={s.detectedTag}>DETECTED</Text>
                <Text style={s.detectedItem}>{result.detected_item}</Text>
                <Text style={s.detectedCategory}>{result.style_category}</Text>
              </View>
              <View style={s.detectedColors}>
                {result.primary_colors.map((c, i) => (
                  <View key={i} style={s.primaryColorChip}>
                    <Text style={s.primaryColorText}>{c}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Suggested palette */}
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>🎨 Suggested Colour Palette</Text>
            </View>
            <View style={s.paletteRow}>
              {result.suggested_palette.map((color, i) => (
                <View key={i} style={s.paletteChip}>
                  <Text style={s.paletteChipText}>{color}</Text>
                </View>
              ))}
            </View>

            {/* Three look cards */}
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>✨ Your Styled Looks</Text>
            </View>
            {result.looks.map((look, i) => (
              <LookCardView
                key={i}
                look={look}
                onFindShops={() => router.push("/shopdetail")}
              />
            ))}

            {/* ── Style Battle ── */}
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>⚡ Style Battle</Text>
              <Text style={s.sectionSub}>Which look speaks to you?</Text>
            </View>
            <View style={s.battleRow}>
              {/* Traditional */}
              <TouchableOpacity
                style={[
                  s.battleCard,
                  s.battleCardTrad,
                  battleChoice === "traditional" && s.battleCardSelected,
                ]}
                onPress={() => setBattleChoice("traditional")}
                activeOpacity={0.85}
              >
                {battleChoice === "traditional" && (
                  <View style={s.battleCheckBadge}>
                    <Text style={s.battleCheckText}>✓</Text>
                  </View>
                )}
                <Text style={s.battleCardEmoji}>🪷</Text>
                <Text style={s.battleCardName}>
                  {result.battle.traditional.title}
                </Text>
                <Text style={s.battleCardDesc}>
                  {result.battle.traditional.description}
                </Text>
                {result.battle.traditional.items.map((item, i) => (
                  <View key={i} style={s.battleItem}>
                    <Text style={s.battleItemText}>• {item}</Text>
                  </View>
                ))}
              </TouchableOpacity>

              {/* Trendy */}
              <TouchableOpacity
                style={[
                  s.battleCard,
                  s.battleCardTrendy,
                  battleChoice === "trendy" && s.battleCardSelected,
                ]}
                onPress={() => setBattleChoice("trendy")}
                activeOpacity={0.85}
              >
                {battleChoice === "trendy" && (
                  <View
                    style={[s.battleCheckBadge, { backgroundColor: "#9060C8" }]}
                  >
                    <Text style={s.battleCheckText}>✓</Text>
                  </View>
                )}
                <Text style={s.battleCardEmoji}>✨</Text>
                <Text style={s.battleCardName}>
                  {result.battle.trendy.title}
                </Text>
                <Text style={s.battleCardDesc}>
                  {result.battle.trendy.description}
                </Text>
                {result.battle.trendy.items.map((item, i) => (
                  <View key={i} style={s.battleItem}>
                    <Text style={s.battleItemText}>• {item}</Text>
                  </View>
                ))}
              </TouchableOpacity>
            </View>

            {/* Vote bar */}
            <View style={s.voteBarContainer}>
              <View style={s.voteBarBg}>
                <View
                  style={[s.voteBarFill, { width: `${tradPct}%` as any }]}
                />
              </View>
              <View style={s.voteBarLabels}>
                <Text style={s.voteBarLabel}>{tradPct}% Traditional</Text>
                <Text style={s.voteBarLabel}>{100 - tradPct}% Trendy</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[s.voteBtn, voted && s.voteBtnDone]}
              onPress={castVote}
              disabled={voted}
            >
              <Text style={s.voteBtnText}>
                {voted
                  ? `You voted ${battleChoice === "traditional" ? "Traditional 🪷" : "Trendy ✨"}`
                  : "Cast My Vote →"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 20, paddingTop: 60 },

  // Header
  header: { marginBottom: 24 },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  backText: { color: C.primary, fontSize: 20, fontWeight: "bold" },
  headerContent: { flexDirection: "row", alignItems: "center", gap: 16 },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconText: { color: C.white, fontSize: 18, fontWeight: "900" },
  headerTitle: { fontSize: 28, fontWeight: "900", color: C.text },
  headerSub: { fontSize: 13, color: C.textSec, marginTop: 2 },

  // Card wrapper
  card: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 16,
  },
  cardLabel: {
    fontSize: 14,
    color: C.textSec,
    marginBottom: 14,
    fontWeight: "600",
  },

  // Upload
  uploadZone: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: C.primary,
    borderRadius: 16,
    minHeight: 140,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadZoneActive: { borderStyle: "solid", borderColor: C.primary },
  uploadPreview: { width: "100%", height: 220, borderRadius: 14 },
  removeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  removeBtnText: { color: C.white, fontSize: 14, fontWeight: "bold" },
  uploadPlaceholder: { alignItems: "center", padding: 24 },
  uploadPlaceholderIcon: { fontSize: 36, marginBottom: 8 },
  uploadPlaceholderText: {
    fontSize: 15,
    fontWeight: "700",
    color: C.primary,
    marginBottom: 4,
  },
  uploadPlaceholderHint: { fontSize: 12, color: C.textMuted },

  // Filter chips
  filterBlock: { marginBottom: 14 },
  filterLabel: {
    fontSize: 12,
    color: C.textMuted,
    fontWeight: "600",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  filterScroll: { gap: 8, paddingRight: 8 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    marginRight: 8,
  },
  filterChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  filterChipText: { fontSize: 13, color: C.textSec, fontWeight: "600" },
  filterChipTextActive: { color: C.white },

  // Analyze button
  analyzeBtn: { borderRadius: 16, overflow: "hidden", marginBottom: 16 },
  analyzeBtnGradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  analyzeBtnText: { color: C.white, fontSize: 17, fontWeight: "800" },

  // Error
  errorBanner: {
    backgroundColor: "rgba(239,68,68,0.07)",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.2)",
    alignItems: "center",
  },
  errorText: {
    color: C.error,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  errorSub: { color: C.textMuted, fontSize: 12 },

  // Detected card
  detectedCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  detectedLeft: { flex: 1 },
  detectedTag: {
    fontSize: 10,
    color: C.primary,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  detectedItem: {
    fontSize: 20,
    fontWeight: "800",
    color: C.text,
    marginBottom: 4,
  },
  detectedCategory: { fontSize: 14, color: C.textSec },
  detectedColors: { gap: 6, alignItems: "flex-end" },
  primaryColorChip: {
    backgroundColor: C.surface,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: C.border,
  },
  primaryColorText: { fontSize: 12, color: C.primary, fontWeight: "600" },

  // Section header
  sectionHeader: { marginBottom: 12, marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: C.text },
  sectionSub: { fontSize: 13, color: C.textSec, marginTop: 3 },

  // Palette
  paletteRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  paletteChip: {
    backgroundColor: C.white,
    borderRadius: 99,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: C.border,
  },
  paletteChipText: { fontSize: 13, color: C.primary, fontWeight: "600" },

  // Look card
  lookCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  lookCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 14,
  },
  lookEmoji: { fontSize: 28, marginTop: 2 },
  lookTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.text,
    marginBottom: 6,
  },
  tierBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 99,
    alignSelf: "flex-start",
  },
  tierBadgeText: { fontSize: 11, fontWeight: "700" },
  lookPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: C.text,
    textAlign: "right",
    marginTop: 4,
  },

  lookGrid: { gap: 10, marginBottom: 12 },
  detailCell: {
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(212,67,124,0.10)",
  },
  detailCellLabel: {
    fontSize: 11,
    color: C.textMuted,
    fontWeight: "600",
    marginBottom: 4,
  },
  detailCellValue: { fontSize: 14, fontWeight: "600", color: C.text },
  colorsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 },
  colorPill: {
    backgroundColor: C.surface,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: C.border,
  },
  colorPillText: { fontSize: 12, color: C.primary, fontWeight: "600" },

  shopsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 14,
  },
  shopsLabel: { fontSize: 12, color: C.textMuted, fontWeight: "600" },
  shopsValue: { fontSize: 13, color: C.primary, fontWeight: "700", flex: 1 },

  findBtn: { borderRadius: 14, overflow: "hidden" },
  findBtnGradient: { paddingVertical: 14, alignItems: "center" },
  findBtnText: { color: C.white, fontSize: 15, fontWeight: "700" },

  // Battle
  battleRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  battleCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    alignItems: "center",
    position: "relative",
  },
  battleCardTrad: { backgroundColor: "#FFFAF0", borderColor: "#E8C080" },
  battleCardTrendy: { backgroundColor: "#F8F0FF", borderColor: "#C0A0E8" },
  battleCardSelected: { transform: [{ scale: 1.03 }] },
  battleCheckBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  battleCheckText: { color: C.white, fontSize: 13, fontWeight: "bold" },
  battleCardEmoji: { fontSize: 32, marginBottom: 8 },
  battleCardName: {
    fontSize: 14,
    fontWeight: "800",
    color: C.text,
    marginBottom: 4,
    textAlign: "center",
  },
  battleCardDesc: {
    fontSize: 11,
    color: C.textMuted,
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 16,
  },
  battleItem: { width: "100%", marginBottom: 3 },
  battleItemText: { fontSize: 12, color: C.textSec },

  // Vote
  voteBarContainer: { marginBottom: 14 },
  voteBarBg: {
    height: 8,
    borderRadius: 99,
    backgroundColor: C.surface,
    overflow: "hidden",
    marginBottom: 6,
  },
  voteBarFill: { height: "100%", borderRadius: 99, backgroundColor: C.primary },
  voteBarLabels: { flexDirection: "row", justifyContent: "space-between" },
  voteBarLabel: { fontSize: 12, color: C.textMuted, fontWeight: "600" },
  voteBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
    marginBottom: 20,
  },
  voteBtnDone: { backgroundColor: C.surface },
  voteBtnText: { fontSize: 15, fontWeight: "700", color: C.primary },
});
