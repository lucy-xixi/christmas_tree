
import { GoogleGenAI } from "@google/genai";

// 预设的高质量圣诞背景图（作为 Fallback）
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1543589077-47d81606c1ad?q=80&w=1080&auto=format&fit=crop";

/**
 * Generates a Christmas scene using Gemini API.
 * Uses gemini-2.5-flash-image for general image generation tasks.
 */
export async function generateChristmasScene(): Promise<string> {
  const apiKey = process.env.API_KEY;

  // 如果没有 API Key，直接返回预设图片，避免调用失败
  if (!apiKey || apiKey === "undefined" || apiKey.length < 5) {
    console.warn("API_KEY not found or invalid. Using fallback image.");
    return FALLBACK_IMAGE;
  }

  try {
    // Always use process.env.API_KEY directly when initializing the GoogleGenAI client as per SDK guidelines.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
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

    // Safely iterate through candidates and parts to find the generated image data.
    if (response.candidates && response.candidates.length > 0 && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        // Find the image part, do not assume it is always the first part.
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    
    return FALLBACK_IMAGE;
  } catch (error) {
    console.error("Error generating Christmas scene:", error);
    return FALLBACK_IMAGE;
  }
}
