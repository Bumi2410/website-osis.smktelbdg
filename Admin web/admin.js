import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  collection, addDoc, deleteDoc, doc, getDoc, getDocs,
  orderBy, query, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = document.getElementById("adminApp");
const loading = document.getElementById("adminLoading");
const content = document.getElementById("pageContent");
const title = document.getElementById("pageTitle");
const subtitle = document.getElementById("pageSubtitle");
const navButtons = [...document.querySelectorAll(".nav-item")];

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.replace("login.html");
    return;
  }

  try {
    const adminDoc = await getDoc(doc(db, "admins", user.uid));
    if (!adminDoc.exists()) {
      await signOut(auth);
      window.location.replace("login.html");
      return;
    }

    currentUser = user;
    document.getElementById("adminEmail").textContent = user.email || "Admin";
    loading.hidden = true;
    app.hidden = false;
    await showPage("dashboard");
  } catch (error) {
    console.error(error);
    loading.textContent = "Tidak dapat memverifikasi akses. Periksa koneksi dan Firestore Rules.";
  }
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.replace("login.html");
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => showPage(button.dataset.page));
});

async function showPage(page) {
  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.page === page);
  });

  const pages = {
    dashboard: ["Nama Pilihan Dashboard", "Ringkasan aktivitas website OSIS."],
    news: ["Upload News", "Tambahkan berita terbaru ke database website."],
    activity: ["Upload Activity", "Tambahkan dokumentasi atau kegiatan OSIS."],
    suggestion: ["Suggestion", "Kritik dan saran yang dikirim melalui website."],
    inbox: ["Inbox", "Pesan masuk dari pengunjung."]
  };

  title.textContent = pages[page][0];
  subtitle.textContent = pages[page][1];
  content.innerHTML = '<p class="muted-note">Memuat data...</p>';

  try {
    if (page === "dashboard") await renderDashboard();
    if (page === "news") renderUploadForm("news");
    if (page === "activity") renderUploadForm("activities");
    if (page === "suggestion") await renderMessages("kritik_saran", "suggestion");
    if (page === "inbox") await renderMessages("inbox", "inbox");
  } catch (error) {
    console.error(error);
    content.innerHTML = '<p class="empty-state">Data gagal dimuat. Periksa Firestore Rules dan koneksi Firebase.</p>';
  }
}

async function renderDashboard() {
  const [news, activities, suggestions] = await Promise.all([
    getDocs(collection(db, "news")),
    getDocs(collection(db, "activities")),
    getDocs(collection(db, "kritik_saran"))
  ]);

  content.innerHTML = `
    <div class="stats-grid">
      <article class="stat-card"><span>Total News</span><strong>${news.size}</strong></article>
      <article class="stat-card"><span>Total Activity</span><strong>${activities.size}</strong></article>
      <article class="stat-card"><span>Kritik &amp; Saran</span><strong>${suggestions.size}</strong></article>
    </div>
    <div class="welcome-card">
      <h3>Selamat datang, Admin!</h3>
      <p>Gunakan menu di sebelah kiri untuk mengelola berita, kegiatan, dan masukan dari siswa.</p>
    </div>`;
}

function renderUploadForm(type) {
  const isNews = type === "news";
  const collectionName = type;
  content.innerHTML = `
    <form class="data-form" id="uploadForm">
      <label>Judul
        <input name="title" maxlength="120" required placeholder="${isNews ? "Judul berita" : "Nama kegiatan"}">
      </label>
      <label>Deskripsi
        <textarea name="description" rows="5" maxlength="3000" required placeholder="Tulis deskripsi..."></textarea>
      </label>
      <label>URL gambar (opsional)
        <input name="imageUrl" type="url" placeholder="https://...">
      </label>
      <button class="primary-btn" type="submit" id="uploadSubmit">Simpan ${isNews ? "News" : "Activity"}</button>
      <p class="form-message" id="uploadMessage" role="status"></p>
    </form>
    <p class="muted-note">Data akan disimpan ke koleksi Firestore <code>${collectionName}</code>. Agar tampil di halaman utama, website publik perlu membaca koleksi ini.</p>`;

  const form = document.getElementById("uploadForm");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = document.getElementById("uploadSubmit");
    const message = document.getElementById("uploadMessage");
    button.disabled = true;
    message.textContent = "Menyimpan...";
    try {
      await addDoc(collection(db, collectionName), {
        title: form.elements.title.value.trim(),
        description: form.elements.description.value.trim(),
        imageUrl: form.elements.imageUrl.value.trim(),
        createdAt: serverTimestamp(),
        createdBy: currentUser.uid
      });
      form.reset();
      message.textContent = "Berhasil disimpan ke Firebase.";
      message.classList.remove("is-error");
    } catch (error) {
      console.error(error);
      message.textContent = "Gagal menyimpan data. Periksa Firestore Rules.";
      message.classList.add("is-error");
    } finally {
      button.disabled = false;
    }
  });
}

async function renderMessages(collectionName, type) {
  const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    content.innerHTML = '<p class="empty-state">Belum ada pesan.</p>';
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "message-list";

  snapshot.forEach((item) => {
    const data = item.data();
    const card = document.createElement("article");
    card.className = "message-card";

    const heading = document.createElement("div");
    heading.className = "message-heading";
    const name = document.createElement("strong");
    name.textContent = data.nama || data.name || data.email || "Pengunjung";
    const remove = document.createElement("button");
    remove.className = "delete-btn";
    remove.textContent = "Hapus";
    remove.type = "button";
    heading.append(name, remove);

    const meta = document.createElement("p");
    meta.className = "message-meta";
    meta.textContent = [data.kelas, data.email].filter(Boolean).join(" • ");

    const body = document.createElement("p");
    body.className = "message-body";
    body.textContent = data.pesan || data.message || data.subject || "(Pesan kosong)";

    card.append(heading);
    if (meta.textContent) card.append(meta);
    card.append(body);

    remove.addEventListener("click", async () => {
      if (!confirm("Hapus pesan ini?")) return;
      remove.disabled = true;
      try {
        await deleteDoc(doc(db, collectionName, item.id));
        card.remove();
        if (!wrapper.children.length) {
          content.innerHTML = '<p class="empty-state">Belum ada pesan.</p>';
        }
      } catch (error) {
        console.error(error);
        alert("Pesan gagal dihapus. Periksa Firestore Rules.");
        remove.disabled = false;
      }
    });

    wrapper.append(card);
  });

  content.replaceChildren(wrapper);
}
