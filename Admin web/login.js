import { auth, db } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("loginForm");
const message = document.getElementById("loginMessage");
const submit = document.getElementById("loginSubmit");

async function checkAdmin(user) {
  const adminRef = doc(db, "admins", user.uid);
  const adminSnap = await getDoc(adminRef);
  return adminSnap.exists();
}

onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  try {
    if (await checkAdmin(user)) {
      window.location.replace("admin.html");
    } else {
      await auth.signOut();
    }
  } catch (error) {
    console.error(error);
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = form.elements.email.value.trim();
  const password = form.elements.password.value;

  submit.disabled = true;
  message.textContent = "Memeriksa akun...";
  message.className = "form-message";

  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    if (!(await checkAdmin(credential.user))) {
      await auth.signOut();
      throw new Error("Akun ini belum diberi akses admin.");
    }
    window.location.href = "admin.html";
  } catch (error) {
    console.error("Login error:", error);
    message.textContent = error.message.includes("akses admin")
      ? error.message
      : "Email atau password salah, atau akun belum terdaftar.";
    message.classList.add("is-error");
  } finally {
    submit.disabled = false;
  }
});
