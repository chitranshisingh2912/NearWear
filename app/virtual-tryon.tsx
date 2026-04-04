// app/virtual-tryon.tsx
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { ThemedText } from "../components/themed-text";
import { ThemedView } from "../components/themed-view";
import { useVirtualTryOn } from "../hooks/useVirtualTryOn";

export default function VirtualTryOnScreen() {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const { resultImage, isLoading, error, generateTryOn, reset } =
    useVirtualTryOn();

  // Pick person image from camera/gallery
  const pickPersonImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera roll permissions");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPersonImage(result.assets[0].uri);
      // Reset result when new image selected
      if (resultImage) reset();
    }
  };

  // Pick garment image
  const pickGarmentImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera roll permissions");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setGarmentImage(result.assets[0].uri);
      if (resultImage) reset();
    }
  };

  // Handle try-on generation
  const handleTryOn = async () => {
    if (!personImage || !garmentImage) {
      Alert.alert(
        "Missing Images",
        "Please select both person and garment images",
      );
      return;
    }

    await generateTryOn(personImage, garmentImage);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText style={styles.title}>Virtual Try-On</ThemedText>

        {/* Person Image Selection */}
        <View style={styles.section}>
          <ThemedText style={styles.label}>1. Your Photo</ThemedText>
          <TouchableOpacity style={styles.imageBox} onPress={pickPersonImage}>
            {personImage ? (
              <Image source={{ uri: personImage }} style={styles.image} />
            ) : (
              <View style={styles.placeholder}>
                <ThemedText>+ Add Your Photo</ThemedText>
                <ThemedText style={styles.hint}>
                  Full body or upper body
                </ThemedText>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Garment Image Selection */}
        <View style={styles.section}>
          <ThemedText style={styles.label}>2. Garment Photo</ThemedText>
          <TouchableOpacity style={styles.imageBox} onPress={pickGarmentImage}>
            {garmentImage ? (
              <Image source={{ uri: garmentImage }} style={styles.image} />
            ) : (
              <View style={styles.placeholder}>
                <ThemedText>+ Add Garment</ThemedText>
                <ThemedText style={styles.hint}>
                  Flat lay or on model
                </ThemedText>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={[
            styles.generateButton,
            (!personImage || !garmentImage || isLoading) &&
              styles.disabledButton,
          ]}
          onPress={handleTryOn}
          disabled={!personImage || !garmentImage || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Generate Try-On</ThemedText>
          )}
        </TouchableOpacity>

        {/* Error Display */}
        {error && (
          <View style={styles.errorBox}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </View>
        )}

        {/* Result Display */}
        {resultImage && (
          <View style={styles.section}>
            <ThemedText style={styles.label}>Result</ThemedText>
            <View style={styles.resultBox}>
              <Image source={{ uri: resultImage }} style={styles.resultImage} />
            </View>
            <TouchableOpacity style={styles.resetButton} onPress={reset}>
              <ThemedText style={styles.resetText}>Try Another</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  imageBox: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  hint: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  generateButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorBox: {
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  errorText: {
    color: "#c62828",
    textAlign: "center",
  },
  resultBox: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultImage: {
    width: "100%",
    height: 400,
    resizeMode: "cover",
  },
  resetButton: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  resetText: {
    color: "#333",
    fontWeight: "600",
  },
});
