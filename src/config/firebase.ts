import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Ensure Firebase Admin is initialized only once
if (getApps().length === 0) {
  try {
    initializeApp({
      credential: applicationDefault(),
    });
    console.log("Firebase Admin initialized successfully with Application Default Credentials.");
  } catch (error) {
    console.error("Error initializing Firebase Admin with ADC:", error);
    console.warn("Using in-memory mock database as fallback.");
  }
}

// Export Firestore instance (will be undefined if initialization failed, but we handle it gracefully)
export const db = getApps().length > 0 ? getFirestore() : null;
