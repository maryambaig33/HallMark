import { GoogleGenAI } from "@google/genai";
import { Coordinates, SearchResult, GroundingChunk } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchStores = async (
  query: string,
  userLocation?: Coordinates
): Promise<SearchResult> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Configure tools
    const tools = [{ googleMaps: {} }];
    
    // Configure retrieval config if location is available
    let toolConfig;
    if (userLocation) {
      toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
        },
      };
    }

    const response = await ai.models.generateContent({
      model,
      contents: query,
      config: {
        tools,
        toolConfig,
        systemInstruction: `You are an intelligent store assistant for Hallmark. 
        Your goal is to help users find Hallmark stores based on their location and specific needs (e.g., ornaments, cards, gifts).
        When the user asks for stores, provide a helpful summary of the options found using the Google Maps tool.
        Highlight unique features mentioned in reviews if possible.
        Be festive, warm, and helpful.`,
      },
    });

    const text = response.text || "I couldn't find any specific store details right now.";
    
    // Extract map grounding chunks
    const candidates = response.candidates;
    const groundingChunks = candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Filter for maps data
    const stores = groundingChunks
      .filter((chunk: GroundingChunk) => chunk.maps)
      .map((chunk: GroundingChunk) => chunk.maps!);

    return {
      text,
      stores,
    };

  } catch (error) {
    console.error("Error searching stores:", error);
    throw new Error("Failed to search for stores. Please try again.");
  }
};