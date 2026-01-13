// Firebase configuration helper for the API
// Exports the client config and tries to initialize firebase-admin if available.

const firebaseConfig = {
  apiKey: "AIzaSyD-kKvk7z4TRQ90acRKqypoUlkStJR0IDI",
  authDomain: "flutterapp-ab422.firebaseapp.com",
  projectId: "flutterapp-ab422",
  storageBucket: "flutterapp-ab422.firebasestorage.app",
  messagingSenderId: "831814433480",
  appId: "1:831814433480:web:da63e7f740884ebd3643fd",
  measurementId: "G-PBGC175GDB"
};

let adminInitialized = false;

try {
  // Try to initialize firebase-admin if it's installed and credentials are provided
  const admin = require('firebase-admin');
  if (!admin.apps || admin.apps.length === 0) {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      adminInitialized = true;
      console.log('Firebase Admin initialized via application default credentials.');
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // Optional: accept a JSON string in env var FIREBASE_SERVICE_ACCOUNT
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
        adminInitialized = true;
        console.log('Firebase Admin initialized via FIREBASE_SERVICE_ACCOUNT env var.');
      } catch (e) {
        console.warn('FIREBASE_SERVICE_ACCOUNT is set but could not be parsed as JSON.');
      }
    } else {
      console.log('firebase-admin present but no credentials found; skipping admin init.');
    }
  }
} catch (e) {
  // firebase-admin not installed; that's fine for now
}

module.exports = { firebaseConfig, adminInitialized };
