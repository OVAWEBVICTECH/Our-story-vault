const fs = require('fs');

const config = {
  projectId: process.env.FIREBASE_PROJECT_ID || "gen-lang-client-0974629623",
  appId: process.env.FIREBASE_APP_ID || "1:804112813118:web:bd05d6e679df0945d6556f",
  apiKey: process.env.FIREBASE_API_KEY || "",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "gen-lang-client-0974629623.firebaseapp.com",
  firestoreDatabaseId: process.env.FIREBASE_FIRESTORE_ID || "ai-studio-ourstoryvault-a3abee59-77dc-4ea3-9fcf-0c147bf4c7e6",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "gen-lang-client-0974629623.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "804112813118",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "",
  oAuthClientId: process.env.FIREBASE_OAUTH_CLIENT_ID || "804112813118-80p76kqpn8ij82all5q08g359aeqkdb9.apps.googleusercontent.com",
  recaptchaSiteKey: process.env.FIREBASE_RECAPTCHA_SITE_KEY || ""
};

fs.writeFileSync('firebase-applet-config.json', JSON.stringify(config, null, 2));
console.log('Wrote firebase-applet-config.json');
