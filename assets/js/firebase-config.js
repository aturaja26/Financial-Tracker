// Konfigurasi Firebase Anda
// GANTI nilai-nilai di bawah ini dengan konfigurasi dari Firebase Console Anda!
const firebaseConfig = {
  apiKey: "AIzaSyDKeEcttW6nT8OvN10eadSf4fZfrOXPne4",
  authDomain: "financial-tracker-833e0.firebaseapp.com",
  projectId: "financial-tracker-833e0",
  storageBucket: "financial-tracker-833e0.firebasestorage.app",
  messagingSenderId: "557626106771",
  appId: "1:557626106771:web:40c74ecf4a99a47088fe66"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);

// Deklarasikan instance Auth dan Firestore global
const db = firebase.firestore();
const authInstance = firebase.auth();
