// app/aiupload.tsx  – Pink theme
import * as ImagePicker from "expo-image-picker";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Image,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { auth, db } from "./firebaseConfig";

const OPENROUTER_API_KEY =
  "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";
const CLOUDINARY_CLOUD_NAME = "dqogp7liu";
const CLOUDINARY_UPLOAD_PRESET = "pk85lyye";

// ── LOCAL theme override (matches pink home) ──────────────────────────────────
const T = {
  bg: "#FFF0F3",
  card: "#FFFFFF",
  surface: "#FFE4EC",
  border: "rgba(212,67,124,0.18)",
  borderLight: "rgba(212,67,124,0.10)",
  inputBorder: "rgba(212,67,124,0.25)",
  primary: "#D4437C",
  primarySoft: "rgba(212,67,124,0.10)",
  text: "#1A1A2E",
  textSec: "#5A5A7A",
  textMuted: "#9E9EBE",
  white: "#FFFFFF",
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
};

interface Shop {
  id: string;
  name: string;
  category: string;
  status: string;
}
interface ProductCard {
  id: string;
  imageUri: string | null;
  uploadedImageUrl: string | null;
  name: string;
  color: string;
  size: string;
  material: string;
  quantity: string;
  price: string;
  description: string;
  uploading: boolean;
}

// ── Step Bar ──────────────────────────────────────────────────────────────────
function StepBar({ step }: { step: number }) {
  const steps = ["Pick Shop", "Select Photos", "AI Analysis", "Edit & Send"];
  return (
    <View style={sb.container}>
      {steps.map((label, i) => {
        const active = i + 1 === step;
        const done = i + 1 < step;
        return (
          <View key={i} style={sb.wrap}>
            <View
              style={[
                sb.circle,
                active && sb.circleActive,
                done && sb.circleDone,
              ]}
            >
              <Text
                style={[sb.circleText, (active || done) && sb.circleTextActive]}
              >
                {done ? "✓" : i + 1}
              </Text>
            </View>
            <Text
              style={[sb.label, active && sb.labelActive]}
              numberOfLines={1}
            >
              {label}
            </Text>
            {i < steps.length - 1 && (
              <View style={[sb.line, done && sb.lineDone]} />
            )}
          </View>
        );
      })}
    </View>
  );
}
const sb = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  wrap: { alignItems: "center", flex: 1, position: "relative" },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: T.surface,
    borderWidth: 2,
    borderColor: T.border,
    alignItems: "center",
    justifyContent: "center",
  },
  circleActive: { borderColor: T.primary, backgroundColor: T.primary },
  circleDone: { borderColor: T.success, backgroundColor: T.success },
  circleText: { color: T.textMuted, fontSize: 12, fontWeight: "700" },
  circleTextActive: { color: T.white },
  label: {
    color: T.textMuted,
    fontSize: 9,
    marginTop: 4,
    textAlign: "center",
    fontWeight: "600",
  },
  labelActive: { color: T.primary },
  line: {
    position: "absolute",
    top: 15,
    left: "55%",
    width: "80%",
    height: 2,
    backgroundColor: T.border,
    zIndex: -1,
  },
  lineDone: { backgroundColor: T.success },
});

// ── Product Edit Card ─────────────────────────────────────────────────────────
function ProductEditCard({
  card,
  index,
  onUpdate,
  onRemove,
}: {
  card: ProductCard;
  index: number;
  onUpdate: (id: string, field: string, value: string) => void;
  onRemove: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  return (
    <View style={pc.card}>
      <TouchableOpacity
        style={pc.header}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={pc.headerLeft}>
          {card.imageUri ? (
            <Image source={{ uri: card.imageUri }} style={pc.thumb} />
          ) : (
            <View style={pc.thumbPlaceholder}>
              <Text style={{ fontSize: 20 }}>👕</Text>
            </View>
          )}
          <View>
            <Text style={pc.cardNum}>Item #{index + 1}</Text>
            <Text style={pc.cardName} numberOfLines={1}>
              {card.name || "Unnamed Item"}
            </Text>
          </View>
        </View>
        <View style={pc.headerRight}>
          <TouchableOpacity
            onPress={() => onRemove(card.id)}
            style={pc.removeBtn}
          >
            <Text style={pc.removeText}>✕</Text>
          </TouchableOpacity>
          <Text style={pc.chevron}>{expanded ? "▲" : "▼"}</Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={pc.body}>
          {card.imageUri && (
            <Image
              source={{ uri: card.imageUri }}
              style={pc.fullImage}
              resizeMode="cover"
            />
          )}
          {[
            { label: "Product Name", field: "name", value: card.name },
            { label: "Color", field: "color", value: card.color },
            { label: "Size", field: "size", value: card.size },
            { label: "Material", field: "material", value: card.material },
            {
              label: "Quantity",
              field: "quantity",
              value: card.quantity,
              keyboard: "numeric" as any,
            },
            {
              label: "Price (₹)",
              field: "price",
              value: card.price,
              keyboard: "numeric" as any,
            },
          ].map(({ label, field, value, keyboard }) => (
            <View key={field} style={pc.fieldWrap}>
              <Text style={pc.fieldLabel}>{label}</Text>
              <TextInput
                style={pc.fieldInput}
                value={value}
                onChangeText={(t) => onUpdate(card.id, field, t)}
                placeholderTextColor={T.textMuted}
                placeholder={`Enter ${label.toLowerCase()}`}
                keyboardType={keyboard || "default"}
              />
            </View>
          ))}
          <View style={pc.fieldWrap}>
            <Text style={pc.fieldLabel}>Description</Text>
            <TextInput
              style={[pc.fieldInput, pc.textArea]}
              value={card.description}
              onChangeText={(t) => onUpdate(card.id, "description", t)}
              placeholderTextColor={T.textMuted}
              placeholder="Detailed product description..."
              multiline
              numberOfLines={4}
            />
          </View>
          {card.uploading && (
            <View style={pc.uploadingRow}>
              <ActivityIndicator size="small" color={T.primary} />
              <Text style={pc.uploadingText}>Uploading to Cloudinary...</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
const pc = StyleSheet.create({
  card: {
    backgroundColor: T.card,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: T.border,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: T.surface,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  thumb: { width: 44, height: 44, borderRadius: 10 },
  thumbPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: T.card,
    alignItems: "center",
    justifyContent: "center",
  },
  cardNum: { color: T.primary, fontSize: 10, fontWeight: "700" },
  cardName: { color: T.text, fontSize: 14, fontWeight: "700", maxWidth: 180 },
  removeBtn: {
    backgroundColor: "rgba(239,68,68,0.1)",
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: { color: T.error, fontSize: 12, fontWeight: "700" },
  chevron: { color: T.textMuted, fontSize: 12 },
  body: { padding: 14 },
  fullImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: T.surface,
  },
  fieldWrap: { marginBottom: 12 },
  fieldLabel: {
    color: T.textSec,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldInput: {
    backgroundColor: T.surface,
    borderRadius: 10,
    padding: 12,
    color: T.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: T.inputBorder,
  },
  textArea: { height: 120, textAlignVertical: "top" },
  uploadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  uploadingText: { color: T.textSec, fontSize: 12 },
});

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function AIUploadScreen() {
  const [step, setStep] = useState(1);
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [photosBase64, setPhotosBase64] = useState<string[]>([]);
  const [itemDetails, setItemDetails] = useState({
    category: "kurta",
    color: "",
    size: "",
    material: "",
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState("");
  const [products, setProducts] = useState<ProductCard[]>([]);
  const [sending, setSending] = useState(false);
  const [sendProgress, setSendProgress] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (analyzing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [analyzing]);

  useEffect(() => {
    fetchMyShops();
  }, []);

  const fetchMyShops = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(
        collection(db, "shops"),
        where("ownerId", "==", user.uid),
        where("status", "==", "approved"),
      );
      const snap = await getDocs(q);
      setShops(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Shop[]);
    } catch (_) {}
  };

  const pickPhotos = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow access to your photos.");
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.9,
        base64: true,
        selectionLimit: 10,
      });
      if (!result.canceled && result.assets?.length > 0) {
        setSelectedPhotos(result.assets.map((a) => a.uri));
        setPhotosBase64(result.assets.map((a) => a.base64 || ""));
      }
    } catch (_) {
      Alert.alert("Error", "Failed to pick photos");
    }
  };

  const analyzePhotos = async () => {
    if (selectedPhotos.length === 0) {
      Alert.alert("No photos", "Please select at least one photo.");
      return;
    }
    setStep(3);
    setAnalyzing(true);
    const allCards: ProductCard[] = [];
    try {
      for (let i = 0; i < selectedPhotos.length; i++) {
        setAnalysisProgress(
          `🔍 Analyzing photo ${i + 1} of ${selectedPhotos.length}...`,
        );
        const b64 = photosBase64[i];
        const uri = selectedPhotos[i];
        if (!b64 || b64.length === 0) continue;
        let result: any = null;
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            result = await analyzeOnePhoto(b64, i);
            break;
          } catch (err: any) {
            if (attempt === 0) {
              setAnalysisProgress(`🔄 Retrying photo ${i + 1}...`);
              await new Promise((r) => setTimeout(r, 2000));
            }
          }
        }
        allCards.push({
          id: `card_${Date.now()}_${i}`,
          imageUri: uri,
          uploadedImageUrl: null,
          name: result?.name || "",
          color: result?.color || "",
          size: result?.size || itemDetails.size || "",
          material: result?.material || "",
          quantity: "1",
          price: "",
          description: result?.description || "",
          uploading: false,
        });
      }
      setAnalysisProgress(`✅ ${allCards.length} items analyzed!`);
      setProducts(allCards);
      setStep(4);
    } catch (err: any) {
      Alert.alert("Analysis Failed", err.message || "Please try again.", [
        { text: "OK", onPress: () => setStep(2) },
      ]);
    } finally {
      setAnalyzing(false);
      setAnalysisProgress("");
    }
  };

  const analyzeOnePhoto = async (
    base64: string,
    index: number,
  ): Promise<any> => {
    const categoryContext = getCategoryContext(itemDetails.category);
    const prompt = `You are an expert Indian fashion product photographer and cataloger.\n\nAnalyze this clothing image and return ONLY JSON.\n\nCategory: ${itemDetails.category.toUpperCase()}\n${itemDetails.color ? `Color hint: ${itemDetails.color}` : ""}\n${itemDetails.size ? `Size hint: ${itemDetails.size}` : ""}\n${itemDetails.material ? `Material hint: ${itemDetails.material}` : ""}\n\n${categoryContext}\n\nReturn EXACTLY this JSON (no markdown):\n{"name":"precise Indian garment name with dominant color","color":"exact dominant color with shade","size":"detected size (S/M/L/XL/XXL/Free Size)","material":"detected fabric type","description":"3-4 sentences describing the garment"}`;
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://nearwear.app",
          "X-Title": "NearWear",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-exp:free",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image_url",
                  image_url: { url: `data:image/jpeg;base64,${base64}` },
                },
              ],
            },
          ],
          temperature: 0.2,
          max_tokens: 800,
        }),
      },
    );
    if (!response.ok) {
      const e = await response.json().catch(() => ({}));
      throw new Error(e?.error?.message || `API Error: ${response.status}`);
    }
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    if (!text) throw new Error("Empty response from AI");
    const cleaned = text.replace(/```json|```/g, "").trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
      throw new Error("Could not parse AI response");
    }
  };

  const getCategoryContext = (category: string): string => {
    const ctx: Record<string, string> = {
      kurta:
        "KURTA/KURTI CONTEXT: Look for: straight/A-line silhouette, neckline style, sleeve style, embroidery on yoke/hem/sleeves.",
      saree:
        "SAREE CONTEXT: Look for: fabric drape and texture, border design, pallu design, body print or solid.",
      lehenga:
        "LEHENGA CONTEXT: Look for: flare of skirt, embroidery type, blouse design, dupatta if visible.",
      shirt:
        "SHIRT CONTEXT: Look for: collar style, placket, fit, fabric texture, prints or checks.",
      tops: "TOPS CONTEXT: Look for: neckline style, sleeve length, fit, any prints.",
      dresses:
        "DRESS CONTEXT: Look for: silhouette, neckline, sleeve style, length, patterns.",
      pants:
        "PANTS CONTEXT: Look for: cut, waistband, any embroidery or prints.",
      jeans: "JEANS CONTEXT: Look for: cut, wash, any embellishments.",
      suits:
        "SUIT CONTEXT: Look for: 2 or 3 piece, fabric, embroidery, neckline of kameez.",
      jackets:
        "JACKET CONTEXT: Look for: jacket type, closure, collar, fabric.",
    };
    return (
      ctx[category] ||
      `${category.toUpperCase()} CONTEXT: Identify the exact garment type, color, fabric, and design details.`
    );
  };

  const updateCard = (id: string, field: string, value: string) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  const removeCard = (id: string) =>
    Alert.alert("Remove Item", "Remove this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => setProducts((prev) => prev.filter((p) => p.id !== id)),
      },
    ]);

  const uploadToCloudinary = async (
    imageUri: string,
    shopId: string,
    productId: string,
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: `${productId}.jpg`,
    } as any);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", `nearwear/shops/${shopId}/products`);
    formData.append("public_id", productId);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData },
    );
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.secure_url;
  };

  const sendToShop = async () => {
    if (!selectedShop) return;
    if (products.length === 0) {
      Alert.alert("No items", "Please add at least one product.");
      return;
    }
    const invalid = products.find((p) => !p.name || !p.price);
    if (invalid) {
      Alert.alert(
        "Missing info",
        "Please fill in Name and Price (₹) for all items before sending.",
      );
      return;
    }
    setSending(true);
    let successCount = 0;
    try {
      for (let i = 0; i < products.length; i++) {
        const card = products[i];
        setSendProgress(`📤 Uploading ${i + 1} of ${products.length}...`);
        setProducts((prev) =>
          prev.map((p) => (p.id === card.id ? { ...p, uploading: true } : p)),
        );
        let imageUrl = "";
        try {
          if (card.imageUri)
            imageUrl = await uploadToCloudinary(
              card.imageUri,
              selectedShop.id,
              card.id,
            );
        } catch (_) {}
        await addDoc(collection(db, "shops", selectedShop.id, "products"), {
          name: card.name,
          color: card.color,
          size: card.size,
          material: card.material,
          quantity: parseInt(card.quantity) || 1,
          price: parseFloat(card.price) || 0,
          description: card.description,
          imageUrl,
          shopId: selectedShop.id,
          shopName: selectedShop.name,
          category: itemDetails.category,
          addedViaAI: true,
          createdAt: new Date().toISOString(),
          ownerId: auth.currentUser?.uid,
        });
        setProducts((prev) =>
          prev.map((p) =>
            p.id === card.id
              ? { ...p, uploading: false, uploadedImageUrl: imageUrl }
              : p,
          ),
        );
        successCount++;
      }
      setSendProgress(`✅ ${successCount} items uploaded!`);
      setSuccessModal(true);
    } catch (err: any) {
      Alert.alert(
        "Upload Failed",
        `${successCount} uploaded. Error: ${err.message}`,
      );
    } finally {
      setSending(false);
    }
  };

  const resetAll = () => {
    setStep(1);
    setSelectedShop(null);
    setSelectedPhotos([]);
    setPhotosBase64([]);
    setProducts([]);
    setItemDetails({ category: "kurta", color: "", size: "", material: "" });
    setSuccessModal(false);
  };

  return (
    <View style={ai.container}>
      <StatusBar barStyle="dark-content" backgroundColor={T.bg} />
      <View style={ai.header}>
        <Text style={ai.title}>🤖 AI Product Upload</Text>
        <Text style={ai.subtitle}>
          Select photos → AI analyzes → Auto-fill inventory
        </Text>
      </View>
      <StepBar step={step} />

      <ScrollView
        style={ai.scroll}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── STEP 1 ── */}
        {step === 1 && (
          <View style={ai.section}>
            <Text style={ai.sectionTitle}>Select Your Shop</Text>
            <Text style={ai.sectionSub}>
              Products will be added to this shop
            </Text>
            {shops.length === 0 ? (
              <View style={ai.emptyBox}>
                <Text style={ai.emptyEmoji}>🏪</Text>
                <Text style={ai.emptyText}>No approved shops found</Text>
                <Text style={ai.emptySub}>
                  Your shop must be approved by admin first
                </Text>
              </View>
            ) : (
              shops.map((shop) => (
                <TouchableOpacity
                  key={shop.id}
                  style={[
                    ai.shopCard,
                    selectedShop?.id === shop.id && ai.shopCardActive,
                  ]}
                  onPress={() => setSelectedShop(shop)}
                >
                  <View style={ai.shopCardLeft}>
                    <Text style={ai.shopIcon}>🏪</Text>
                    <View>
                      <Text style={ai.shopName}>{shop.name}</Text>
                      <Text style={ai.shopCat}>{shop.category}</Text>
                    </View>
                  </View>
                  {selectedShop?.id === shop.id && (
                    <Text style={ai.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))
            )}
            {selectedShop && (
              <TouchableOpacity
                style={ai.primaryBtn}
                onPress={() => setStep(2)}
              >
                <Text style={ai.primaryBtnText}>
                  Continue with {selectedShop.name} →
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <View style={ai.section}>
            <TouchableOpacity style={ai.backLink} onPress={() => setStep(1)}>
              <Text style={ai.backLinkText}>← Back</Text>
            </TouchableOpacity>
            <Text style={ai.sectionTitle}>Select Photos & Details</Text>
            <Text style={ai.sectionSub}>
              Better photos = more accurate AI results
            </Text>

            <View style={ai.tipsBox}>
              <Text style={ai.tipsTitle}>📸 Photo Tips for Best Results</Text>
              {[
                "✅ Use good lighting — natural light is best",
                "✅ Show the full garment clearly",
                "✅ Plain background works better",
                "✅ One clothing item per photo",
                "⚠️ Price will be left blank — fill it yourself",
              ].map((t) => (
                <Text key={t} style={ai.tipItem}>
                  {t}
                </Text>
              ))}
            </View>

            {selectedPhotos.length === 0 ? (
              <TouchableOpacity style={ai.photoUploadBox} onPress={pickPhotos}>
                <Text style={ai.photoUploadIcon}>📷</Text>
                <Text style={ai.photoUploadText}>Tap to select photos</Text>
                <Text style={ai.photoUploadSub}>Max 10 photos at a time</Text>
              </TouchableOpacity>
            ) : (
              <>
                <View style={ai.photosContainer}>
                  {selectedPhotos.map((uri, index) => (
                    <View key={index} style={ai.photoThumb}>
                      <Image source={{ uri }} style={ai.thumbImage} />
                      <TouchableOpacity
                        style={ai.removePhotoBtn}
                        onPress={() => {
                          setSelectedPhotos((p) =>
                            p.filter((_, i) => i !== index),
                          );
                          setPhotosBase64((p) =>
                            p.filter((_, i) => i !== index),
                          );
                        }}
                      >
                        <Text style={ai.removePhotoText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  {selectedPhotos.length < 10 && (
                    <TouchableOpacity
                      style={ai.addMoreBtn}
                      onPress={pickPhotos}
                    >
                      <Text style={ai.addMorePlus}>+</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity
                  style={ai.changePhotosBtn}
                  onPress={pickPhotos}
                >
                  <Text style={ai.changePhotosText}>🔄 Change Photos</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Category */}
            <Text style={ai.categoryLabel}>👗 Select Category</Text>
            <View style={ai.categoryGrid}>
              {[
                { key: "kurta", icon: "👘", label: "Kurta/Kurti" },
                { key: "saree", icon: "🥻", label: "Saree" },
                { key: "lehenga", icon: "💃", label: "Lehenga" },
                { key: "suits", icon: "👗", label: "Suit Set" },
                { key: "tops", icon: "👚", label: "Tops" },
                { key: "shirts", icon: "👔", label: "Shirts" },
                { key: "dresses", icon: "🩱", label: "Dresses" },
                { key: "pants", icon: "👖", label: "Pants" },
                { key: "jeans", icon: "🧵", label: "Jeans" },
                { key: "jackets", icon: "🧥", label: "Jackets" },
              ].map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    ai.catCard,
                    itemDetails.category === cat.key && ai.catCardActive,
                  ]}
                  onPress={() =>
                    setItemDetails((v) => ({ ...v, category: cat.key }))
                  }
                >
                  <Text style={ai.catCardIcon}>{cat.icon}</Text>
                  <Text
                    style={[
                      ai.catCardText,
                      itemDetails.category === cat.key && ai.catCardTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={ai.hintsLabel}>💬 Optional Hints</Text>
            <Text style={ai.label}>Size</Text>
            <View style={ai.sizeRow}>
              {["S", "M", "L", "XL", "XXL", "Free Size"].map((sz) => (
                <TouchableOpacity
                  key={sz}
                  style={[
                    ai.sizeChip,
                    itemDetails.size === sz && ai.sizeChipActive,
                  ]}
                  onPress={() => setItemDetails((v) => ({ ...v, size: sz }))}
                >
                  <Text
                    style={[
                      ai.sizeChipText,
                      itemDetails.size === sz && ai.sizeChipTextActive,
                    ]}
                  >
                    {sz}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={ai.label}>Color Hint (optional)</Text>
            <TextInput
              style={ai.input}
              value={itemDetails.color}
              onChangeText={(t) => setItemDetails((v) => ({ ...v, color: t }))}
              placeholder="e.g. Grey, Blue, Red"
              placeholderTextColor={T.textMuted}
            />
            <Text style={ai.label}>Material Hint (optional)</Text>
            <TextInput
              style={ai.input}
              value={itemDetails.material}
              onChangeText={(t) =>
                setItemDetails((v) => ({ ...v, material: t }))
              }
              placeholder="e.g. Cotton, Silk, Georgette"
              placeholderTextColor={T.textMuted}
            />

            <TouchableOpacity
              style={[
                ai.primaryBtn,
                selectedPhotos.length === 0 && ai.primaryBtnDisabled,
              ]}
              onPress={analyzePhotos}
              disabled={selectedPhotos.length === 0}
            >
              <Text style={ai.primaryBtnText}>
                🤖 Analyze{" "}
                {selectedPhotos.length > 0
                  ? `${selectedPhotos.length} Photo(s)`
                  : "Photos"}{" "}
                with AI
              </Text>
            </TouchableOpacity>
            <Text style={ai.priceNote}>
              💡 Price will be left blank — you fill it in after AI analysis
            </Text>
          </View>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <View style={ai.analyzingContainer}>
            <Animated.View
              style={[ai.aiOrb, { transform: [{ scale: pulseAnim }] }]}
            >
              <Text style={ai.aiOrbText}>🤖</Text>
            </Animated.View>
            <Text style={ai.analyzingTitle}>AI Analyzing...</Text>
            <Text style={ai.analyzingProgress}>{analysisProgress}</Text>
            <ActivityIndicator
              size="large"
              color={T.primary}
              style={{ marginTop: 24 }}
            />
            <Text style={ai.analyzingHint}>
              Detecting color, fabric, style and{"\n"}writing unique
              descriptions for each item
            </Text>
          </View>
        )}

        {/* ── STEP 4 ── */}
        {step === 4 && (
          <View style={ai.section}>
            <View style={ai.step4Header}>
              <View>
                <Text style={ai.sectionTitle}>
                  Review ({products.length} items)
                </Text>
                <Text style={ai.sectionSub}>Fill in Price ₹ then send</Text>
              </View>
              <TouchableOpacity
                style={ai.addMoreItemsBtn}
                onPress={() => setStep(2)}
              >
                <Text style={ai.addMoreItemsText}>+ Add More</Text>
              </TouchableOpacity>
            </View>
            <View style={ai.priceReminder}>
              <Text style={ai.priceReminderText}>
                ⚠️ Fill in the Price (₹) for each item before sending
              </Text>
            </View>
            {products.map((card, index) => (
              <ProductEditCard
                key={card.id}
                card={card}
                index={index}
                onUpdate={updateCard}
                onRemove={removeCard}
              />
            ))}
            {sendProgress ? (
              <View style={ai.progressBox}>
                <ActivityIndicator size="small" color={T.success} />
                <Text style={ai.progressText}>{sendProgress}</Text>
              </View>
            ) : null}
            <TouchableOpacity
              style={[ai.sendBtn, sending && ai.sendBtnDisabled]}
              onPress={sendToShop}
              disabled={sending}
            >
              {sending ? (
                <ActivityIndicator color={T.white} />
              ) : (
                <>
                  <Text style={ai.sendBtnText}>
                    🚀 Send {products.length} Items to {selectedShop?.name}
                  </Text>
                  <Text style={ai.sendBtnSub}>
                    Products will appear in your shop collection
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={successModal} transparent animationType="fade">
        <View style={ai.modalOverlay}>
          <View style={ai.modalBox}>
            <Text style={ai.modalEmoji}>🎉</Text>
            <Text style={ai.modalTitle}>All Done!</Text>
            <Text style={ai.modalSub}>
              {products.length} products added to {selectedShop?.name}!
            </Text>
            <TouchableOpacity style={ai.modalBtn} onPress={resetAll}>
              <Text style={ai.modalBtnText}>Upload More Items</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const ai = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 20, fontWeight: "800", color: T.text },
  subtitle: { color: T.textSec, fontSize: 13, marginTop: 2 },
  scroll: { flex: 1 },
  section: { paddingHorizontal: 16 },
  sectionTitle: {
    color: T.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  sectionSub: { color: T.textSec, fontSize: 13, marginBottom: 16 },
  backLink: { marginBottom: 12 },
  backLinkText: { color: T.primary, fontSize: 14, fontWeight: "600" },

  tipsBox: {
    backgroundColor: "rgba(16,185,129,0.06)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.2)",
  },
  tipsTitle: {
    color: T.success,
    fontWeight: "700",
    fontSize: 13,
    marginBottom: 8,
  },
  tipItem: { color: T.textSec, fontSize: 12, marginBottom: 4, lineHeight: 18 },

  photoUploadBox: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: T.border,
    borderStyle: "dashed",
    padding: 40,
    alignItems: "center",
    marginBottom: 20,
  },
  photoUploadIcon: { fontSize: 48, marginBottom: 12 },
  photoUploadText: { color: T.text, fontSize: 16, fontWeight: "700" },
  photoUploadSub: { color: T.textMuted, fontSize: 13, marginTop: 4 },

  photosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  photoThumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
    position: "relative",
    overflow: "hidden",
  },
  thumbImage: { width: "100%", height: "100%" },
  removePhotoBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.45)",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  removePhotoText: { color: T.white, fontSize: 10, fontWeight: "700" },
  addMoreBtn: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: T.surface,
    borderWidth: 2,
    borderColor: T.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  addMorePlus: { color: T.primary, fontSize: 32, fontWeight: "700" },
  changePhotosBtn: {
    backgroundColor: T.surface,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  changePhotosText: { color: T.primary, fontSize: 14, fontWeight: "600" },

  categoryLabel: {
    color: T.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  catCard: {
    width: "18%",
    aspectRatio: 1,
    backgroundColor: T.card,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: T.border,
    padding: 4,
  },
  catCardActive: { backgroundColor: T.primary, borderColor: T.primary },
  catCardIcon: { fontSize: 20, marginBottom: 2 },
  catCardText: {
    color: T.textMuted,
    fontSize: 9,
    textAlign: "center",
    fontWeight: "600",
  },
  catCardTextActive: { color: T.white },

  hintsLabel: {
    color: T.textSec,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 4,
  },
  sizeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  sizeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: T.card,
    borderWidth: 1,
    borderColor: T.border,
  },
  sizeChipActive: { backgroundColor: T.primary, borderColor: T.primary },
  sizeChipText: { color: T.textSec, fontSize: 13, fontWeight: "600" },
  sizeChipTextActive: { color: T.white },

  label: { color: T.textSec, fontSize: 13, marginBottom: 8, marginTop: 8 },
  input: {
    backgroundColor: T.card,
    borderRadius: 12,
    padding: 14,
    color: T.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: T.inputBorder,
    marginBottom: 4,
  },

  primaryBtn: {
    backgroundColor: T.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  primaryBtnDisabled: { backgroundColor: T.textMuted, opacity: 0.5 },
  primaryBtnText: { color: T.white, fontWeight: "700", fontSize: 15 },
  priceNote: {
    color: T.textMuted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 8,
  },

  shopCard: {
    backgroundColor: T.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: T.border,
  },
  shopCardActive: { borderColor: T.primary, backgroundColor: T.surface },
  shopCardLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  shopIcon: { fontSize: 28 },
  shopName: { color: T.text, fontWeight: "700", fontSize: 15 },
  shopCat: { color: T.textMuted, fontSize: 12, marginTop: 2 },
  checkmark: { color: T.primary, fontSize: 20, fontWeight: "900" },

  analyzingContainer: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  aiOrb: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: T.surface,
    borderWidth: 3,
    borderColor: T.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  aiOrbText: { fontSize: 52 },
  analyzingTitle: {
    color: T.text,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
  },
  analyzingProgress: {
    color: T.textSec,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  analyzingHint: {
    color: T.textMuted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
    lineHeight: 20,
  },

  step4Header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  addMoreItemsBtn: {
    backgroundColor: T.surface,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: T.primary,
  },
  addMoreItemsText: { color: T.primary, fontSize: 13, fontWeight: "700" },

  priceReminder: {
    backgroundColor: "rgba(245,158,11,0.08)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.25)",
  },
  priceReminderText: { color: T.warning, fontSize: 13, fontWeight: "600" },

  progressBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(16,185,129,0.08)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  progressText: { color: T.success, fontSize: 13 },

  sendBtn: {
    backgroundColor: T.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginTop: 8,
  },
  sendBtnDisabled: { opacity: 0.6 },
  sendBtnText: {
    color: T.white,
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 4,
  },
  sendBtnSub: { color: "rgba(255,255,255,0.8)", fontSize: 12 },

  emptyBox: { alignItems: "center", padding: 40 },
  emptyEmoji: { fontSize: 50, marginBottom: 12 },
  emptyText: { color: T.text, fontSize: 18, fontWeight: "800" },
  emptySub: {
    color: T.textMuted,
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  modalBox: {
    backgroundColor: T.card,
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: T.border,
    width: "100%",
  },
  modalEmoji: { fontSize: 60, marginBottom: 16 },
  modalTitle: {
    color: T.text,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 12,
  },
  modalSub: {
    color: T.textSec,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  modalBtn: {
    backgroundColor: T.primary,
    borderRadius: 12,
    padding: 16,
    width: "100%",
    alignItems: "center",
  },
  modalBtnText: { color: T.white, fontWeight: "700", fontSize: 15 },
});
