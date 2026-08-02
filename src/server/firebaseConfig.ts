import fs from 'fs';
import path from 'path';

export interface FirebaseConfig {
  projectId: string;
  appId: string;
  apiKey: string;
  authDomain: string;
  firestoreDatabaseId: string;
  storageBucket: string;
  messagingSenderId: string;
  measurementId: string;
  oAuthClientId: string;
  recaptchaSiteKey: string;
}

export function getFirebaseConfig(): FirebaseConfig {
  let fileConfig: Partial<FirebaseConfig> = {};

  try {
    const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf-8');
      fileConfig = JSON.parse(content);
    }
  } catch {
    // Gracefully handle missing or unreadable config file
  }

  return {
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || fileConfig.projectId || '',
    appId: process.env.FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID || fileConfig.appId || '',
    apiKey: process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY || fileConfig.apiKey || '',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN || fileConfig.authDomain || '',
    firestoreDatabaseId: process.env.FIREBASE_FIRESTORE_DATABASE_ID || process.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || fileConfig.firestoreDatabaseId || '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET || fileConfig.storageBucket || '',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || fileConfig.messagingSenderId || '',
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || process.env.VITE_FIREBASE_MEASUREMENT_ID || fileConfig.measurementId || '',
    oAuthClientId: process.env.FIREBASE_OAUTH_CLIENT_ID || process.env.VITE_FIREBASE_OAUTH_CLIENT_ID || fileConfig.oAuthClientId || '',
    recaptchaSiteKey: process.env.FIREBASE_RECAPTCHA_SITE_KEY || process.env.VITE_FIREBASE_RECAPTCHA_SITE_KEY || fileConfig.recaptchaSiteKey || '',
  };
}
