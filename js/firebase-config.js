import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { initializeFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA--Bb3mS8GxL4MddxylpCefyZ45EjrmFg",
  authDomain: "nyc-auth-36984.firebaseapp.com",
  projectId: "nyc-auth-36984",
  storageBucket: "nyc-auth-36984.firebasestorage.app",
  messagingSenderId: "861189582123",
  appId: "1:861189582123:web:2f2efba07ac0a89955296e",
  measurementId: "G-JF3KF1D2F0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});
