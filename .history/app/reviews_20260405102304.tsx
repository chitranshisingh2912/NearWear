import { useRouter } from "expo-router";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { auth, db } from "./firebaseConfig";

export default function ReviewsScreen() {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState("");
  const shopId = "shop1";

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const q = query(collection(db, "reviews"), where("shopId", "==", shopId));
      const snap = await getDocs(q);
      setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.log(err);
    }
    setFetching(false);
  };

  const submitReview = async () => {
    if (!comment.trim()) return;
    setLoading(true);
    try {
      const user = auth.currentUser;
      await addDoc(collection(db, "reviews"), {
        shopId,
        userId: user?.uid,
        userName: user?.email?.split("@")[0] || "User",
        rating,
        comment,
        createdAt: new Date().toISOString(),
      });
      setComment("");
      setRating(5);
      setSuccess("✅ Review submitted!");
      fetchReviews();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "0";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>⭐ Reviews</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Rating Summary */}
        <View style={styles.summaryBox}>
          <Text style={styles.avgRating}>{avgRating}</Text>
          <Text style={styles.stars}>
            {"⭐".repeat(Math.round(Number(avgRating)))}
          </Text>
          <Text style={styles.totalReviews}>{reviews.length} reviews</Text>
        </View>

        {/* Write Review */}
        <View style={styles.writeBox}>
          <Text style={styles.writeTitle}>Write a Review</Text>
          <Text style={styles.label}>Your Rating</Text>
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((r) => (
              <TouchableOpacity key={r} onPress={() => setRating(r)}>
                <Text
                  style={[styles.starBtn, r <= rating && styles.starActive]}
                >
                  ⭐
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Your Review</Text>
          <TextInput
            style={styles.input}
            placeholder="Share your experience..."
            placeholderTextColor="#666"
            value={comment}
            onChangeText={setComment}
            multiline
          />
          {success ? <Text style={styles.successText}>{success}</Text> : null}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={submitReview}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Submit Review</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Reviews List */}
        <Text style={styles.sectionTitle}>All Reviews</Text>
        {fetching ? (
          <ActivityIndicator color="#e94560" />
        ) : reviews.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              No reviews yet. Be the first! 🌟
            </Text>
          </View>
        ) : (
          reviews.map((r) => (
            <View key={r.id} style={styles.reviewCard}>
              <View style={styles.reviewTop}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewAvatarText}>👤</Text>
                </View>
                <View style={styles.reviewMeta}>
                  <Text style={styles.reviewName}>{r.userName}</Text>
                  <Text style={styles.reviewDate}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.reviewRating}>{"⭐".repeat(r.rating)}</Text>
              </View>
              <Text style={styles.reviewComment}>{r.comment}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a2e" },
  header: {
    padding: 24,
    paddingTop: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  back: { color: "#e94560", fontSize: 16 },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  content: { padding: 16 },
  summaryBox: {
    backgroundColor: "#16213e",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  avgRating: { fontSize: 56, fontWeight: "bold", color: "#e94560" },
  stars: { fontSize: 24, marginVertical: 8 },
  totalReviews: { color: "#a0a0b0", fontSize: 14 },
  writeBox: {
    backgroundColor: "#16213e",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  writeTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 12,
  },
  label: { color: "#a0a0b0", fontSize: 14, marginBottom: 8 },
  ratingRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  starBtn: { fontSize: 28, opacity: 0.3 },
  starActive: { opacity: 1 },
  input: {
    backgroundColor: "#0f3460",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  successText: { color: "#4CAF50", fontSize: 13, marginBottom: 8 },
  submitBtn: {
    backgroundColor: "#e94560",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  emptyBox: { alignItems: "center", padding: 24 },
  emptyText: { color: "#a0a0b0", fontSize: 14 },
  reviewCard: {
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2a2a4a",
  },
  reviewTop: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0f3460",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  reviewAvatarText: { fontSize: 18 },
  reviewMeta: { flex: 1 },
  reviewName: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  reviewDate: { color: "#a0a0b0", fontSize: 12 },
  reviewRating: { fontSize: 12 },
  reviewComment: { color: "#a0a0b0", fontSize: 14, lineHeight: 20 },
});
