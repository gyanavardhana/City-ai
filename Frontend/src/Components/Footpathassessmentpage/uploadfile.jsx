import { GoogleAIFileManager } from "@google/generative-ai/server";
import { Blob } from "blob-polyfill";

const apiKey = import.meta.env.VITE_APP_GOOGLE_GENERATIVE_AI_API_KEY;
const fileManager = new GoogleAIFileManager(apiKey);

const uploadFileToGemini = async (file, mimeType) => {
  try {
    const blob = new Blob([file], { type: mimeType });
    const fileStream = blob.stream();
    const uploadResult = await fileManager.uploadFile(fileStream, {
      mimeType,
      displayName: file.name,
    });
    const fileUrl = uploadResult.file.uri;
    return fileUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

export { uploadFileToGemini };