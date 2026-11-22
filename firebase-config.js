
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBbaY7KqSnkHdlInzGGSy0mUfiCIUX2QYA",
  authDomain: "osis-kritik-saran.firebaseapp.com",
  projectId: "osis-kritik-saran",
  storageBucket: "osis-kritik-saran.firebasestorage.app",
  messagingSenderId: "238939970846",
  appId: "1:238939970846:web:06a054bb53c1d1fd947d0f",
  measurementId: "G-HE34KY2945"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
