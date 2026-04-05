// services/virtualTryOn.ts
import * as FileSystem from "expo-file-system";

interface VirtualTryOnResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

interface TryOnParams {
  personImageUri: string; // Local file URI from camera/gallery
  garmentImageUri: string; // Local file URI or remote URL
  prompt?: string;
  steps?: number;
  guidanceScale?: number;
  autoMasking?: boolean;
}

const GRADIO_API_URL = "https://yisol-idm-vton.hf.space/api/predict";

/**
 * Converts a local image URI to base64 string
 */
async function imageToBase64(uri: string): Promise<string> {
  try {
    // For remote URLs, fetch first
    if (uri.startsWith("http")) {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }

    // For local files
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
    // Convert both images to base64
    const [personBase64, garmentBase64] = await Promise.all([
      imageToBase64(personImageUri),
      imageToBase64(garmentImageUri),
    ]);

    // Call Hugging Face Gradio API
    const response = await fetch(GRADIO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [
          `data:image/png;base64,${personBase64}`, // Person image
          `data:image/png;base64,${garmentBase64}`, // Garment image
          prompt, // Optional prompt
          autoMasking, // Auto masking enabled
          steps, // Inference steps (20-50)
          guidanceScale, // CFG scale (1.5-3.0)
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();

    // Gradio returns base64 image in data array
    if (result.data && result.data[0]) {
      const resultImageBase64 = result.data[0];

      // Save result to temporary file
      const fileName = `tryon-result-${Date.now()}.png`;
      const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

      // Extract base64 data (remove data:image/png;base64, prefix if present)
      const base64Data = resultImageBase64.replace(
        /^data:image\/\w+;base64,/,
        "",
      );

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return {
        success: true,
        imageUrl: fileUri,
      };
    }

    return {
      success: false,
      error: "No image generated",
    };
  } catch (error) {
    console.error("Virtual Try-On Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
