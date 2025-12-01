import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_MODEL_FLASH } from '../constants';
import { JournalEntry } from '../types';

let ai: GoogleGenAI | null = null;

try {
    // API Key is required from process.env as per instructions
    if (process.env.API_KEY) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    } else {
        console.warn("Gemini API Key missing in process.env.AI_KEY");
    }
} catch (e) {
    console.error("Failed to initialize Gemini Client", e);
}

export const getDetectiveSuggestion = async (entries: JournalEntry[]): Promise<string> => {
  if (!ai || entries.length === 0) return "What is a fond memory from your childhood home?";

  // Create a summary context for the AI
  const recentEntries = entries.slice(0, 10).map(e => `[${e.date}] (${e.category}): ${e.text}`).join('\n');
  
  const prompt = `
    You are a warm, curious, and encouraging biographer's assistant. 
    Here are recent journal entries from a user to understand what they have already written about:
    ${recentEntries}

    Your task is to spark a specific, vivid memory that they haven't written about yet.
    
    Guidelines:
    1. Identify a gap in their timeline (e.g., a missing decade like the 80s or 90s, early career, childhood summers).
    2. Ask ONE specific question about a sensory detail, a specific historical event they might have witnessed, or a small but meaningful moment.
    3. Be encouraging and nostalgic.
    4. Keep it under 25 words.

    Examples of good questions:
    - "What was the first song you remember slow dancing to?"
    - "Describe the smell of the kitchen in your first apartment."
    - "Where were you when you watched the turn of the millennium?"
  `;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_FLASH,
      contents: prompt,
    });
    return response.text || "Tell me about your favorite childhood toy.";
  } catch (error) {
    console.error("Gemini Detective Error:", error);
    return "What is a memory you haven't thought of in years?";
  }
};

export const generateBiographyChapter = async (entries: JournalEntry[]): Promise<string> => {
  if (!ai || entries.length < 3) return "Please write more entries to generate a biography.";

  const fullContext = entries.map(e => `[${e.date}] ${e.text}`).join('\n');

  const prompt = `
    You are a master storyteller and biographer. 
    Take the following raw journal notes and weave them into a cohesive, beautifully written narrative chapter. 
    Use a nostalgic, respectful, and engaging tone. 
    Do not invent facts, but you may add transitional prose to make it flow like a memoir.
    
    Raw Notes:
    ${fullContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_FLASH,
      contents: prompt,
      config: {
          thinkingConfig: { thinkingBudget: 0 } // Disable specific thinking for faster narrative generation
      }
    });
    return response.text || "Could not generate story.";
  } catch (error) {
    console.error("Gemini Story Error:", error);
    return "An error occurred while writing your story. Please try again later.";
  }
};