// hooks/useVirtualTryOn.ts
import { useCallback, useState } from "react";
import { generateVirtualTryOn } from "../services/virtualTryOn";

interface UseVirtualTryOnReturn {
  resultImage: string | null;
  isLoading: boolean;
  error: string | null;
  generateTryOn: (personUri: string, garmentUri: string) => Promise<void>;
  reset: () => void;
}

export function useVirtualTryOn(): UseVirtualTryOnReturn {
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTryOn = useCallback(
    async (personUri: string, garmentUri: string) => {
      setIsLoading(true);
      setError(null);
      setResultImage(null);

      try {
        const result = await generateVirtualTryOn({
          personImageUri: personUri,
          garmentImageUri: garmentUri,
          steps: 30,
          guidanceScale: 2.0,
          autoMasking: true,
        });

        if (result.success && result.imageUrl) {
          setResultImage(result.imageUrl);
        } else {
          setError(result.error || "Failed to generate try-on");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setResultImage(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    resultImage,
    isLoading,
    error,
    generateTryOn,
    reset,
  };
}
