
// NOTE: In a real production app, these should be environment variables.
// For this demo to work, please replace the placeholders below or configure your environment.

export const FIREBASE_CONFIG = {
  apiKey: process.env.FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.FIREBASE_APP_ID || "1:123456:web:abcdef"
};

// The Gemini API key is accessed via process.env.API_KEY as per instructions.
// Ensure your environment is configured to inject this.
export const GEMINI_MODEL_FLASH = 'gemini-2.5-flash';
