// src/services/geminiApi.js

import { GoogleGenerativeAI } from "@google/generative-ai";

// Get the API key from the environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not defined in your .env.local file");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Using the latest stable and powerful model name
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "You are a helpful and friendly chatbot for the India Disaster Monitor application. Your primary purpose is to provide concise, clear, and actionable safety tips related to natural disasters like earthquakes, cyclones, and floods. Keep your answers brief (2-3 sentences) and focused on safety. If asked about something unrelated, politely state that you can only provide disaster safety information.",
});

/**
 * Sends a message to the Gemini AI and gets a response.
 * @param {string} message - The user's message.
 * @returns {Promise<string>} The AI's response.
 */
export async function getAiResponse(message) {
  try {
    const chat = model.startChat();
    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later.";
  }
}