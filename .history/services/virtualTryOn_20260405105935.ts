// services/virtualTryOn.ts
import * as FileSystem from "expo-file-system";

interface VirtualTryOnResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

interface TryOnParams {
  personImageUri: string;
  garmentImageUri: string;
  prompt?: string;
  steps?: number;
  guidanceScale?: number;
  autoMasking?: boolean;
}

const GRADIO_API_URL = "https://yisol-idm-vton.hf.space/api/predict";

/**
 * Converts image URI to base64 - works for both local and remote
 */
async function imageToBase64(uri: string): Promise<string> {
  try {
    if (uri.startsWith("http")) {
      // Download remote URL to temp file first, then read as base64
      const fileName = `temp-${Date.now()}.jpg`;
      const tempUri = `${FileSystem.cacheDirectory}${fileName}`;

      await FileSystem.downloadAsync(uri, tempUri);

      const base64 = await FileSystem.readAsStringAsync(tempUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Clean up temp file
      await FileSystem.deleteAsync(tempUri, { idempotent: true });

      return base64;
    }

    // For local files - direct read
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw new Error("Failed to process image");
  }
}

/**
 * Main virtual try-on function
 */
export async function generateVirtualTryOn({
  personImageUri,
  garmentImageUri,
  prompt = "",
  steps = 30,
  guidanceScale = 2.0,
  autoMasking = true,
}: TryOnParams): Promise<VirtualTryOnResponse> {
  try {
    const [personBase64, garmentBase64] = await Promise.all([
      imageToBase64(personImageUri),
      imageToBase64(garmentImageUri),
    ]);

    const response = await fetch(GRADIO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [
          `data:image/png;base64,${personBase64}`,
          `data:image/png;base64,${garmentBase64}`,
          prompt,
          autoMasking,
          steps,
          guidanceScale,
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();

    if (result.data && result.data[0]) {
      const resultImageBase64 = result.data[0];
      const fileName = `tryon-result-${Date.now()}.png`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
      const base64Data = resultImageBase64.replace(
        /^data:image\/\w+;base64,/,
        "",
      );

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return { success: true, imageUrl: fileUri };
    }

    return { success: false, error: "No image generated" };
  } catch (error) {
    console.error("Virtual Try-On Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
