// app/(tabs)/home.tsx – Kawaii Premium Redesign · NearWear
import { C } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

type MainFilter = "all" | "female" | "male";
type SortFilter =
  | "nearby"
  | "popular"
  | "gi"
  | "rental"
  | "bulk"
  | "old"
  | null;

const FEMALE_SUBCATS = [
  "Sarees",
  "Kurtis",
  "Dresses",
  "Tops",
  "Lehenga",
  "Suits",
];
const MALE_SUBCATS = [
  "Shirts",
  "Kurtas",
  "Sherwanis",
  "Trousers",
  "Jackets",
  "Jeans",
];

const SORT_FILTERS: {
  id: SortFilter;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: "nearby", label: "Nearby", icon: "location-outline" },
  { id: "popular", label: "Popular", icon: "trending-up-outline" },
  { id: "gi", label: "GI Tagged", icon: "ribbon-outline" },
  { id: "old", label: "Old Shops", icon: "time-outline" },
  { id: "bulk", label: "Bulk Order", icon: "layers-outline" },
  { id: "rental", label: "Rental", icon: "repeat-outline" },
];

const SHOPS = [
  {
    id: 1,
    name: "Zara Boutique",
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400",
    rating: 4.8,
    distance: "0.5 km",
    category: "female",
    isPopular: true,
    isGI: false,
    isRental: false,
    isBulk: false,
    isOld: false,
    established: 2020,
    tags: ["Dresses", "Tops"],
    sticker: "🎀",
  },
  {
    id: 2,
    name: "Men's Empire",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400",
    rating: 4.6,
    distance: "1.2 km",
    category: "male",
    isPopular: true,
    isGI: false,
    isRental: true,
    isBulk: false,
    isOld: true,
    established: 1998,
    tags: ["Shirts", "Kurtas"],
    sticker: "✨",
  },
  {
    id: 3,
    name: "Chanderi Silk House",
    image: "https://images.unsplash.com/photo-1583391733951-4b222abcc2d7?w=400",
    rating: 4.9,
    distance: "2.5 km",
    category: "female",
    isPopular: false,
    isGI: true,
    isRental: false,
    isBulk: true,
    isOld: true,
    established: 1985,
    tags: ["Sarees", "Suits"],
    sticker: "💎",
  },
  {
    id: 4,
    name: "Ethnic Elegance",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400",
    rating: 4.7,
    distance: "0.8 km",
    category: "all",
    isPopular: true,
    isGI: true,
    isRental: false,
    isBulk: false,
    isOld: false,
    established: 2015,
    tags: ["Sarees", "Kurtis"],
    sticker: "🌸",
  },
  {
    id: 5,
    name: "Fashion Hub",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400",
    rating: 4.3,
    distance: "3.0 km",
    category: "all",
    isPopular: false,
    isGI: false,
    isRental: true,
    isBulk: true,
    isOld: false,
    established: 2018,
    tags: ["Dresses", "Shirts"],
    sticker: "💕",
  },
  {
    id: 6,
    name: "Maheshwari Textiles",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400",
    rating: 4.5,
    distance: "1.8 km",
    category: "female",
    isPopular: false,
    isGI: true,
    isRental: false,
    isBulk: true,
    isOld: true,
    established: 1970,
    tags: ["Sarees", "Lehenga"],
    sticker: "💖",
  },
];

// ── Floating sparkle particle ─────────────────────────────────────────────────
function FloatParticle({
  emoji,
  x,
  delay,
  dur,
}: {
  emoji: string;
  x: number;
  delay: number;
  dur: number;
}) {
  const y = useRef(new Animated.Value(0)).current;
  const op = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(y, {
            toValue: -80,
            duration: dur,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(op, {
              toValue: 0.7,
              duration: dur * 0.3,
              useNativeDriver: true,
            }),
            Animated.timing(op, {
              toValue: 0,
              duration: dur * 0.7,
              useNativeDriver: true,
            }),
          ]),
        ]),
        Animated.parallel([
          Animated.timing(y, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(op, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, []);

  return (
    <Animated.Text
      style={{
        position: "absolute",
        left: x,
        bottom: 80,
        fontSize: 11,
        opacity: op,
        transform: [{ translateY: y }],
        zIndex: 0,
      }}
    >
      {emoji}
    </Animated.Text>
  );
}

// ── Kawaii cat with blink animation ──────────────────────────────────────────
function KawaiiCat({ style }: { style?: any }) {
  const scaleY = useRef(new Animated.Value(1)).current;
  const floatY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Float
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: -5,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatY, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
    // Blink
    Animated.loop(
      Animated.sequence([
        Animated.delay(3000),
        Animated.timing(scaleY, {
          toValue: 0.1,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(scaleY, {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.delay(200),
        Animated.timing(scaleY, {
          toValue: 0.1,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(scaleY, {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.Text
      style={[
        { fontSize: 22, transform: [{ translateY: floatY }, { scaleY }] },
        style,
      ]}
    >
      🐱
    </Animated.Text>
  );
}

// ── Speech bubble ─────────────────────────────────────────────────────────────
function SpeechBubble({ text, style }: { text: string; style?: any }) {
  const scale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 120,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View style={[s.bubble, { transform: [{ scale }] }, style]}>
      <Text style={s.bubbleText}>{text}</Text>
      <View style={s.bubbleTail} />
    </Animated.View>
  );
}

// ── Sort chip ─────────────────────────────────────────────────────────────────
function SortChip({
  filter,
  active,
  onPress,
}: {
  filter: (typeof SORT_FILTERS)[0];
  active: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.88,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        tension: 200,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[s.sortChip, active && s.sortChipActive]}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        <Ionicons
          name={filter.icon}
          size={12}
          color={active ? "#fff" : C.primary}
        />
        <Text style={[s.sortChipText, active && s.sortChipTextActive]}>
          {filter.label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Shop card with lift animation ─────────────────────────────────────────────
function ShopCard({
  shop,
  onPress,
  index,
}: {
  shop: (typeof SHOPS)[0];
  onPress: () => void;
  index: number;
}) {
  const translateY = useRef(new Animated.Value(30)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(lift, {
      toValue: 1,
      tension: 200,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(lift, {
      toValue: 0,
      tension: 200,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const cardTranslate = lift.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3],
  });
  const cardShadow = lift.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            s.shopCard,
            {
              transform: [{ translateY: cardTranslate }],
              shadowOpacity: cardShadow.interpolate({
                inputRange: [0, 1],
                outputRange: [0.06, 0.2],
              }),
            },
          ]}
        >
          {/* shimmer overlay */}
          <View style={s.shimmerOverlay} />
          <Image source={{ uri: shop.image }} style={s.shopImg} />
          <View style={s.shopInfo}>
            <View style={s.shopNameRow}>
              <Text style={s.shopName} numberOfLines={1}>
                {shop.name}
              </Text>
              {shop.isGI && (
                <View style={s.giBadge}>
                  <Text style={s.giBadgeText}>GI</Text>
                </View>
              )}
            </View>
            <View style={s.shopTagsRow}>
              {shop.isPopular && (
                <View style={s.tag}>
                  <Text style={s.tagText}>Popular</Text>
                </View>
              )}
              {shop.isRental && (
                <View style={s.tag}>
                  <Text style={s.tagText}>Rental</Text>
                </View>
              )}
              {shop.isBulk && (
                <View style={s.tag}>
                  <Text style={s.tagText}>Bulk</Text>
                </View>
              )}
              {shop.isOld && (
                <View style={s.tag}>
                  <Text style={s.tagText}>Est. {shop.established}</Text>
                </View>
              )}
            </View>
            <View style={s.shopMeta}>
              <Ionicons name="star" size={12} color="#FFB800" />
              <Text style={s.shopRating}>{shop.rating}</Text>
              <Ionicons
                name="location-outline"
                size={12}
                color={C.textMuted}
                style={{ marginLeft: 6 }}
              />
              <Text style={s.shopDist}>{shop.distance}</Text>
            </View>
          </View>
          <Text style={s.shopSticker}>{shop.sticker}</Text>
          <Ionicons name="chevron-forward" size={16} color={C.primary} />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Background blob ───────────────────────────────────────────────────────────
function BgBlob({ style }: { style?: any }) {
  const scale = useRef(new Animated.Value(1)).current;
  const tx = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.12,
            duration: 7000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(tx, {
            toValue: 10,
            duration: 7000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1,
            duration: 7000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(tx, {
            toValue: 0,
            duration: 7000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={[style, { transform: [{ scale }, { translateX: tx }] }]}
    />
  );
}

// ── AI Banner sparkle ─────────────────────────────────────────────────────────
function Sparkle({ style }: { style?: any }) {
  const op = useRef(new Animated.Value(0)).current;
  const sc = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(op, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(sc, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(op, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(sc, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(Math.random() * 1000),
      ]),
    ).start();
  }, []);

  return (
    <Animated.Text
      style={[{ fontSize: 12, opacity: op, transform: [{ scale: sc }] }, style]}
    >
      ✦
    </Animated.Text>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const [selectedMain, setSelectedMain] = useState<MainFilter | null>(null);
  const [selectedSort, setSelectedSort] = useState<SortFilter>(null);
  const [selectedSubCat, setSelectedSubCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Glow pulse for search bar
  const glowAnim = useRef(new Animated.Value(0)).current;
  // AI banner breathe
  const bannerScale = useRef(new Animated.Value(1)).current;
  // Gender chip pulse
  const chipPulse = useRef(new Animated.Value(1)).current;
  // Arrow bounce
  const arrowBounce = useRef(new Animated.Value(0)).current;
  // Fade for shop list
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Search glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ]),
    ).start();

    // Banner breathe
    Animated.loop(
      Animated.sequence([
        Animated.timing(bannerScale, {
          toValue: 1.015,
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bannerScale, {
          toValue: 1,
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Chip pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(chipPulse, {
          toValue: 1.04,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(chipPulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Arrow bounce
    Animated.loop(
      Animated.sequence([
        Animated.timing(arrowBounce, {
          toValue: -4,
          duration: 500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(arrowBounce, {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const searchGlowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(212,67,124,0.12)", "rgba(212,67,124,0.32)"],
  });

  const handleMainFilterSelect = useCallback(
    (filter: MainFilter) => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setSelectedMain(filter);
        setSelectedSort(null);
        setSelectedSubCat(null);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      });
    },
    [fadeAnim],
  );

  const handleReset = () => {
    setSelectedMain(null);
    setSelectedSort(null);
    setSelectedSubCat(null);
    setSearchQuery("");
  };

  const filteredShops = SHOPS.filter((shop) => {
    if (
      searchQuery &&
      !shop.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    if (selectedMain && selectedMain !== "all") {
      if (shop.category !== selectedMain && shop.category !== "all")
        return false;
    }
    if (selectedSubCat && !shop.tags.includes(selectedSubCat)) return false;
    switch (selectedSort) {
      case "gi":
        return shop.isGI;
      case "popular":
        return shop.isPopular;
      case "rental":
        return shop.isRental;
      case "bulk":
        return shop.isBulk;
      case "old":
        return shop.isOld;
      default:
        return true;
    }
  }).sort((a, b) => {
    if (selectedSort === "nearby")
      return parseFloat(a.distance) - parseFloat(b.distance);
    if (selectedSort === "popular") return b.rating - a.rating;
    if (selectedSort === "old") return a.established - b.established;
    return 0;
  });

  const subCats =
    selectedMain === "female"
      ? FEMALE_SUBCATS
      : selectedMain === "male"
        ? MALE_SUBCATS
        : [];

  const particles = [
    { emoji: "💕", x: 30, delay: 0, dur: 5000 },
    { emoji: "✨", x: 80, delay: 1200, dur: 6000 },
    { emoji: "⭐", x: 160, delay: 2400, dur: 5500 },
    { emoji: "🌸", x: 230, delay: 600, dur: 7000 },
    { emoji: "💖", x: 300, delay: 3000, dur: 4800 },
    { emoji: "✦", x: 340, delay: 1800, dur: 5200 },
    { emoji: "🎀", x: 40, delay: 4000, dur: 6500 },
    { emoji: "💕", x: 130, delay: 2000, dur: 5800 },
  ];

  return (
    <View style={s.root}>
      {/* Background blobs */}
      <BgBlob style={s.blob1} />
      <BgBlob style={s.blob2} />
      <BgBlob style={s.blob3} />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <FloatParticle key={i} {...p} />
      ))}

      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {/* ── Sticky Header ── */}
        <View style={s.stickyHeader}>
          <View style={s.topRow}>
            <View style={s.locationRow}>
              <Ionicons name="location" size={15} color={C.primary} />
              <Text style={s.locationText}>Gwalior</Text>
            </View>
            <View style={s.headerActions}>
              <TouchableOpacity style={s.iconBtn}>
                <Ionicons
                  name="notifications-outline"
                  size={19}
                  color={C.text}
                />
                <View style={s.notifDot} />
              </TouchableOpacity>
              <TouchableOpacity
                style={s.avatarBtn}
                onPress={() => router.push("/profile")}
              >
                <Text style={s.avatarText}>C</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={s.heroTitle}>Vocal for Local</Text>
          <View style={s.heroUnderline} />

          {/* Search with cat */}
          <View style={s.searchRow}>
            <Animated.View
              style={[s.searchBox, { borderColor: searchGlowColor }]}
            >
              <Ionicons name="search-outline" size={17} color={C.textMuted} />
              <TextInput
                style={s.searchInput}
                placeholder="Search shops, products..."
                placeholderTextColor={C.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </Animated.View>
            <TouchableOpacity style={s.filterIconBtn}>
              <Ionicons name="options-outline" size={19} color="#fff" />
            </TouchableOpacity>
            {/* Cat near search */}
            <KawaiiCat style={s.catSearch} />
            <SpeechBubble text="Find it! 🔍" style={s.bubbleSearch} />
          </View>

          {/* Gender + sub filters */}
          <View style={s.mainFiltersRow}>
            {selectedMain && (
              <TouchableOpacity style={s.backArrowBtn} onPress={handleReset}>
                <Ionicons name="arrow-back" size={18} color={C.primary} />
              </TouchableOpacity>
            )}
            {!selectedMain ? (
              <>
                <TouchableOpacity
                  style={s.genderChip}
                  onPress={() => handleMainFilterSelect("female")}
                >
                  <Ionicons name="woman" size={15} color={C.primary} />
                  <Text style={s.genderChipText}>Female Wear</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={s.genderChip}
                  onPress={() => handleMainFilterSelect("male")}
                >
                  <Ionicons name="man" size={15} color={C.primary} />
                  <Text style={s.genderChipText}>Male Wear</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Animated.View style={{ transform: [{ scale: chipPulse }] }}>
                  <TouchableOpacity
                    style={s.activeGenderChip}
                    activeOpacity={0.9}
                  >
                    <Ionicons
                      name={selectedMain === "female" ? "woman" : "man"}
                      size={15}
                      color="#fff"
                    />
                    <Text style={s.activeGenderChipText}>
                      {selectedMain === "female" ? "Female Wear" : "Male Wear"}
                    </Text>
                    <TouchableOpacity onPress={handleReset}>
                      <Ionicons
                        name="close-circle"
                        size={17}
                        color="rgba(255,255,255,0.8)"
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </Animated.View>
                {/* Cat beside chip */}
                <KawaiiCat style={{ marginLeft: 4 }} />
                <SpeechBubble
                  text="Try this! 👗"
                  style={{ top: -28, left: 0 }}
                />
              </View>
            )}
          </View>

          {selectedMain && subCats.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.subCatScroll}
            >
              {subCats.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    s.subCatChip,
                    selectedSubCat === cat && s.subCatChipActive,
                  ]}
                  onPress={() =>
                    setSelectedSubCat(selectedSubCat === cat ? null : cat)
                  }
                >
                  <Text
                    style={[
                      s.subCatText,
                      selectedSubCat === cat && s.subCatTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {selectedMain && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.sortScroll}
            >
              {SORT_FILTERS.map((f) => (
                <SortChip
                  key={f.id}
                  filter={f}
                  active={selectedSort === f.id}
                  onPress={() =>
                    setSelectedSort(selectedSort === f.id ? null : f.id)
                  }
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* ── Body ── */}
        <View style={s.body}>
          {/* AI Banner */}
          <Animated.View style={{ transform: [{ scale: bannerScale }] }}>
            <TouchableOpacity
              style={s.aiBanner}
              onPress={() => router.push("/aistylist")}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={["#D4437C", "#E91E8C", "#F06292"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.aiBannerGrad}
              >
                <Sparkle
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 60,
                    color: "rgba(255,255,255,0.7)",
                  }}
                />
                <Sparkle
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 72,
                    color: "rgba(255,255,255,0.6)",
                  }}
                />
                <Sparkle
                  style={{
                    position: "absolute",
                    bottom: 8,
                    left: 130,
                    color: "rgba(255,255,255,0.5)",
                  }}
                />
                <View style={s.aiBannerIcon}>
                  <Ionicons name="sparkles" size={21} color="#FFD700" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.aiBannerTitle}>Outfit for Occasion</Text>
                  <Text style={s.aiBannerSub}>
                    AI picks a full look from local shops
                  </Text>
                </View>
                <Animated.View
                  style={[
                    s.aiBannerArrow,
                    { transform: [{ translateX: arrowBounce }] },
                  ]}
                >
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </Animated.View>
                {/* Cat on banner */}
                <Text style={s.catBanner}>🐱</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Promo card */}
          {!selectedMain && (
            <View style={s.promoCard}>
              <View style={s.promoContent}>
                <View style={s.promoBadge}>
                  <Text style={s.promoBadgeText}>LIMITED TIME ✨</Text>
                </View>
                <Text style={s.promoTitle}>Wedding Season{"\n"}Sale 💍</Text>
                <Text style={s.promoSub}>
                  Up to 40% off on bridal collections
                </Text>
                <TouchableOpacity style={s.exploreBtn}>
                  <Text style={s.exploreBtnText}>Explore Now →</Text>
                </TouchableOpacity>
              </View>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=300",
                }}
                style={s.promoImage}
              />
            </View>
          )}

          {/* Shops section */}
          <View style={s.shopsSectionHeader}>
            <Text style={s.shopsSectionTitle}>
              {selectedMain
                ? `${selectedMain === "female" ? "Female" : "Male"} Shops`
                : "Shops Near You"}
            </Text>
            <TouchableOpacity>
              <Text style={s.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <Animated.View style={{ opacity: fadeAnim }}>
            {filteredShops.length === 0 ? (
              <View style={s.emptyBox}>
                <Text style={s.emptyEmoji}>🏪</Text>
                <Text style={s.emptyText}>No shops found</Text>
                <Text style={s.emptySub}>Try a different filter</Text>
              </View>
            ) : (
              filteredShops.map((shop, i) => (
                <ShopCard
                  key={shop.id}
                  shop={shop}
                  index={i}
                  onPress={() => router.push("/shopdetail")}
                />
              ))
            )}
          </Animated.View>

          {/* Sleeping cat above tab bar */}
          <View style={s.sleepingCatWrap}>
            <Text style={s.zzz}>z z z</Text>
            <KawaiiCat style={s.sleepingCat} />
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFF0F5" },

  // Background blobs
  blob1: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(249,168,212,0.22)",
    top: -80,
    right: -60,
    zIndex: 0,
  },
  blob2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(212,67,124,0.08)",
    top: 280,
    left: -60,
    zIndex: 0,
  },
  blob3: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(240,171,252,0.14)",
    bottom: 180,
    right: -50,
    zIndex: 0,
  },

  // Sticky header
  stickyHeader: {
    backgroundColor: "rgba(255,240,245,0.97)",
    paddingTop: 52,
    paddingHorizontal: 18,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(212,67,124,0.1)",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  locationText: { fontSize: 13, color: C.text, fontWeight: "700" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconBtn: {
    position: "relative",
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(212,67,124,0.12)",
  },
  notifDot: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: C.primary,
    borderWidth: 1.5,
    borderColor: "#FFF0F5",
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "900", fontSize: 15 },

  heroTitle: {
    fontSize: 27,
    fontWeight: "900",
    color: C.text,
    marginBottom: 3,
  },
  heroUnderline: {
    width: 72,
    height: 3,
    backgroundColor: C.primary,
    borderRadius: 2,
    marginBottom: 14,
  },

  // Search
  searchRow: {
    flexDirection: "row",
    gap: 9,
    marginBottom: 12,
    alignItems: "center",
    position: "relative",
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    paddingHorizontal: 12,
    gap: 7,
    borderWidth: 1.5,
    height: 46,
  },
  searchInput: { flex: 1, fontSize: 13, color: C.text },
  filterIconBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  catSearch: { position: "absolute", right: 56, top: -14, zIndex: 10 },
  bubbleSearch: { position: "absolute", right: 52, top: -38, zIndex: 11 },

  // Speech bubble
  bubble: {
    backgroundColor: "rgba(255,255,255,0.97)",
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(212,67,124,0.18)",
    shadowColor: "#d4437c",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 20,
  },
  bubbleText: {
    fontSize: 10,
    fontWeight: "700",
    color: C.primary,
    whiteSpace: "nowrap",
  } as any,
  bubbleTail: {
    position: "absolute",
    bottom: -5,
    left: "50%",
    marginLeft: -4,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "rgba(255,255,255,0.97)",
  },

  // Gender filters
  mainFiltersRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 9,
    flexWrap: "wrap",
  },
  backArrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "rgba(212,67,124,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  genderChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderWidth: 1.5,
    borderColor: C.primary,
  },
  genderChipText: { fontSize: 13, fontWeight: "700", color: C.primary },
  activeGenderChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: C.primary,
  },
  activeGenderChipText: { fontSize: 13, fontWeight: "700", color: "#fff" },

  // Sub cats
  subCatScroll: { gap: 7, paddingRight: 10, paddingBottom: 2 },
  subCatChip: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1,
    borderColor: "rgba(212,67,124,0.14)",
    marginRight: 7,
  },
  subCatChipActive: {
    backgroundColor: "rgba(212,67,124,0.1)",
    borderColor: C.primary,
  },
  subCatText: { fontSize: 12, color: C.textSec, fontWeight: "600" },
  subCatTextActive: { color: C.primary, fontWeight: "700" },

  // Sort chips
  sortScroll: { gap: 7, paddingVertical: 8, paddingRight: 10 },
  sortChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1,
    borderColor: "rgba(212,67,124,0.15)",
    marginRight: 7,
  },
  sortChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  sortChipText: { fontSize: 11, color: C.primary, fontWeight: "600" },
  sortChipTextActive: { color: "#fff" },

  // Body
  body: { paddingHorizontal: 18, paddingTop: 14 },

  // AI Banner
  aiBanner: { borderRadius: 20, overflow: "hidden", marginBottom: 14 },
  aiBannerGrad: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    gap: 11,
    position: "relative",
  },
  aiBannerIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  aiBannerTitle: { fontSize: 16, fontWeight: "800", color: "#fff" },
  aiBannerSub: { fontSize: 11, color: "rgba(255,255,255,0.85)", marginTop: 2 },
  aiBannerArrow: {
    width: 32,
    height: 32,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  catBanner: { position: "absolute", bottom: 6, right: 52, fontSize: 18 },

  // Promo
  promoCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    flexDirection: "row",
    overflow: "hidden",
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(212,67,124,0.1)",
    shadowColor: "#d4437c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  promoContent: { flex: 1, padding: 16 },
  promoBadge: {
    backgroundColor: "rgba(212,67,124,0.08)",
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 99,
    marginBottom: 7,
  },
  promoBadgeText: { fontSize: 10, color: C.primary, fontWeight: "700" },
  promoTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: C.text,
    lineHeight: 24,
    marginBottom: 5,
  },
  promoSub: { fontSize: 11, color: C.textSec, marginBottom: 12 },
  exploreBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1.5,
    borderColor: C.primary,
    alignSelf: "flex-start",
  },
  exploreBtnText: { color: C.primary, fontSize: 12, fontWeight: "700" },
  promoImage: { width: 130, height: "100%" as any },

  // Shops
  shopsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  shopsSectionTitle: { fontSize: 17, fontWeight: "800", color: C.text },
  viewAllText: { fontSize: 12, color: C.primary, fontWeight: "700" },

  shopCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 20,
    padding: 11,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: "rgba(212,67,124,0.1)",
    gap: 11,
    shadowColor: "#d4437c",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
    overflow: "hidden",
  },
  shimmerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(212,67,124,0.06)",
    zIndex: 1,
    pointerEvents: "none",
  } as any,
  shopImg: { width: 70, height: 70, borderRadius: 14 },
  shopInfo: { flex: 1 },
  shopNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  shopName: { fontSize: 14, fontWeight: "800", color: C.text, flex: 1 },
  giBadge: {
    backgroundColor: "#FFF3CD",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#FFB800",
  },
  giBadgeText: { fontSize: 9, fontWeight: "800", color: "#B7860B" },
  shopTagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 5,
  },
  tag: {
    backgroundColor: "rgba(212,67,124,0.08)",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  tagText: { fontSize: 9, color: C.primary, fontWeight: "600" },
  shopMeta: { flexDirection: "row", alignItems: "center" },
  shopRating: { fontSize: 11, color: C.text, fontWeight: "700", marginLeft: 3 },
  shopDist: { fontSize: 11, color: C.textMuted, marginLeft: 3 },
  shopSticker: { fontSize: 18, position: "absolute", top: 8, right: 28 },

  // Sleeping cat
  sleepingCatWrap: { alignItems: "center", paddingVertical: 8 },
  sleepingCat: { fontSize: 28 },
  zzz: { fontSize: 11, color: "#beb0c8", fontWeight: "700", marginBottom: 2 },

  // Empty
  emptyBox: { alignItems: "center", paddingVertical: 36 },
  emptyEmoji: { fontSize: 44, marginBottom: 10 },
  emptyText: { fontSize: 17, fontWeight: "800", color: C.text },
  emptySub: { fontSize: 12, color: C.textMuted, marginTop: 5 },
});
