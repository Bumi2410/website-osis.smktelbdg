
import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("kritikForm");
const submitBtn = document.getElementById("kritikSubmit");
const status = document.getElementById("kritikStatus");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nama = form.elements.namedItem("nama").value.trim();
    const kelas = form.elements.namedItem("kelas").value.trim();
    const pesan = form.elements.namedItem("pesan").value.trim();

    if (!nama || !kelas || !pesan) {
      status.textContent = "Semua kolom wajib diisi.";
      return;
    }

    submitBtn.disabled = true;
    status.textContent = "Mengirim kritik dan saran...";

    try {
      await addDoc(collection(db, "kritik_saran"), {
        nama,
        kelas,
        pesan,
        createdAt: serverTimestamp()
      });

      status.textContent = "Terima kasih! Kritik dan saran berhasil dikirim.";
      form.reset();

    } catch (error) {
      console.error("Firebase error:", error);
      status.textContent = "Gagal mengirim. Silakan coba lagi.";
    } finally {
      submitBtn.disabled = false;
    }
  });
}
