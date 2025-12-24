
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Fallback high-quality Christmas background image
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1543589077-47d81606c1ad?q=80&w=1080&auto=format&fit=crop";

/**
 * Generates a Christmas scene using Gemini API.
 * Uses gemini-2.5-flash-image for general image generation tasks.
 */
export async function generateChristmasScene(): Promise<string> {
  try {
    // Always use process.env.API_KEY directly when initializing the GoogleGenAI client.
    // Assuming API_KEY is pre-configured and accessible.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `A high-quality, vertical 9:16 Christmas scene. 
            Background: A large, cozy, beautifully lit suburban house with warm glowing golden windows, 
            detailed architectural features (gables, porch), and colorful string lights outlining the roof. 
            Foreground: A realistic, tall, magnificent Christmas tree decorated with twinkling golden lights, 
            colorful ornaments, and silver tinsel. Many wrapped gifts under the tree. 
            Environment: Gently falling snow, soft moonlit winter night sky. 
            Atmosphere: Warm, cheerful, cozy holiday feel, vivid colors, 8k resolution.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "9:16"
        }
      }
    });

    // Safely iterate through candidates and parts with strict null checks
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content?.parts;
      if (parts) {
        for (const part of parts) {
          // Iterate through all parts to find the image part; do not assume the first part is an image.
          if (part.inlineData && part.inlineData.data) {
            const base64EncodeString: string = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/png';
            return `data:${mimeType};base64,${base64EncodeString}`;
          }
        }
      }
    }
    
    return FALLBACK_IMAGE;
  } catch (error) {
    console.error("Error generating Christmas scene:", error);
    return FALLBACK_IMAGE;
  }
}
