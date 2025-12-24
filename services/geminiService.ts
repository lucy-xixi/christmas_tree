
import { GoogleGenAI } from "@google/genai";

// Fix: Always use new GoogleGenAI({ apiKey: process.env.API_KEY }) as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSantaImage = async (): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: 'A cute and playful cartoon illustration of a smiling Santa Claus in the center, wearing a classic red Christmas outfit with a white-trimmed hat. The style is bright and warm with a cinematic feel. High resolution, high quality digital art, clean lines.',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    // Fix: Access response.candidates[0].content.parts to find the image part
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Santa Generation Error:", error);
    return null;
  }
};

export const editTreeWithAI = async (base64Image: string, prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: 'image/png',
            },
          },
          {
            text: `This is a Christmas scene. Please edit this image: ${prompt}.`,
          },
        ],
      },
    });

    // Fix: Access response.candidates[0].content.parts to find the image part
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
