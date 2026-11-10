// 1) Konfigurasi aplikasi Firebase milik Anda
export const firebaseConfig = {
  apiKey: "AIzaSyD9KqXrQmr5agCK_u8hC5BSeIz5KXKo88I",
  authDomain: "live-typing-display.firebaseapp.com",
  databaseURL: "https://live-typing-display-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "live-typing-display",
  storageBucket: "live-typing-display.appspot.com",
  messagingSenderId: "642310946394",
  appId: "1:642310946394:web:1b4b4cb56a0ef3987ba263"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, set, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const dbRef = ref;
export const dbSet = set;
export const dbOnValue = onValue;
export const dbServerTimestamp = serverTimestamp;
export const ready = signInAnonymously(auth);