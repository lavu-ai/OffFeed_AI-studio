import { GoogleGenAI } from "@google/genai";

export const generateVideo = async (
  prompt: string, 
  aspectRatio: '16:9' | '9:16' = '16:9',
  resolution: '720p' | '1080p' = '720p'
) => {
  // Create a new instance right before the call to get the latest API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      config: {
        numberOfVideos: 1,
        resolution,
        aspectRatio
      }
    });
    return operation;
  } catch (error) {
    console.error("Video generation error:", error);
    throw error;
  }
};

export const pollVideoOperation = async (operation: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const updatedOperation = await ai.operations.getVideosOperation({ operation });
    return updatedOperation;
  } catch (error) {
    console.error("Polling error:", error);
    throw error;
  }
};

export const fetchVideoBlob = async (downloadLink: string) => {
  const apiKey = process.env.API_KEY || '';
  const response = await fetch(downloadLink, {
    method: 'GET',
    headers: {
      'x-goog-api-key': apiKey,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch video: ${response.statusText}`);
  }
  
  return await response.blob();
};
