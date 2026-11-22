import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  collection, addDoc, deleteDoc, doc, getDoc, getDocs, updateDoc,
  orderBy, query, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = document.getElementById("adminApp");
const loading = document.getElementById("adminLoading");
const content = document.getElementById("pageContent");
const title = document.getElementById("pageTitle");
const subtitle = document.getElementById("pageSubtitle");
const navButtons = [...document.querySelectorAll(".nav-item")];
let currentUser = null;
let activePage = "dashboard";

onAuthStateChanged(auth, async (user) => {
  if (!user) { location.replace("login.html"); return; }
  try {
    const adminDoc = await getDoc(doc(db, "admins", user.uid));
    if (!adminDoc.exists()) { await signOut(auth); location.replace("login.html"); return; }
    currentUser = user;
    document.getElementById("adminEmail").textContent = user.email || "Admin";
    loading.hidden = true;
    app.hidden = false;
    await showPage("dashboard");
  } catch (error) {
    console.error(error);
    loading.textContent = "Tidak dapat memverifikasi admin. Periksa Firestore Rules.";
  }
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  location.replace("login.html");
});
navButtons.forEach((button) => button.addEventListener("click", () => showPage(button.dataset.page)));

async function showPage(page) {
  activePage = page;
  navButtons.forEach((button) => button.classList.toggle("active", button.dataset.page === page));
  const pages = {
    dashboard: ["Dashboard", "Ringkasan konten website OSIS."],
    news: ["News & Announcement", "Tambah, edit, dan hapus berita yang tampil di website utama."],
    activity: ["Our Activity", "Kelola dokumentasi kegiatan sesuai slider website utama."],
    suggestion: ["Suggestion", "Kritik dan saran dari pengunjung."],
    inbox: ["Inbox", "Pesan masuk dari pengunjung."]
  };
  title.textContent = pages[page][0];
  subtitle.textContent = pages[page][1];
  content.innerHTML = '<p class="muted-note">Memuat data...</p>';
  try {
    if (page === "dashboard") await renderDashboard();
    if (page === "news") await renderContentManager("news");
    if (page === "activity") await renderContentManager("activities");
    if (page === "suggestion") await renderMessages("kritik_saran");
    if (page === "inbox") await renderMessages("inbox");
  } catch (error) {
    console.error(error);
    content.innerHTML = '<p class="empty-state">Data gagal dimuat. Periksa koneksi Firebase dan Firestore Rules.</p>';
  }
}

async function renderDashboard() {
  const [news, activities, suggestions] = await Promise.all([
    getDocs(collection(db, "news")), getDocs(collection(db, "activities")),
    getDocs(collection(db, "kritik_saran"))
  ]);
  content.innerHTML = `<div class="stats-grid">
    <article class="stat-card"><span>Total News</span><strong>${news.size}</strong></article>
    <article class="stat-card"><span>Total Activity</span><strong>${activities.size}</strong></article>
    <article class="stat-card"><span>Kritik &amp; Saran</span><strong>${suggestions.size}</strong></article>
  </div><div class="welcome-card"><h3>Selamat datang, Admin!</h3>
  <p>Konten yang kamu simpan di sini akan ditampilkan di website utama tanpa deploy ulang.</p></div>`;
}


async function callAdminApi(endpoint, payload) {
  const token = await auth.currentUser.getIdToken();
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Permintaan upload gagal.");
  return result;
}

async function uploadFile(file, folder) {
  if (!file) return null;
  const isPdf = file.type === "application/pdf";
  const resourceType = isPdf ? "raw" : "image";
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const publicId = `${Date.now()}_${safeName}`;
  const signed = await callAdminApi("/api/cloudinary-signature", {
    folder, publicId, resourceType
  });

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signed.apiKey);
  formData.append("timestamp", String(signed.timestamp));
  formData.append("public_id", signed.publicId);
  formData.append("signature", signed.signature);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${signed.cloudName}/${resourceType}/upload`;
  const response = await fetch(uploadUrl, { method: "POST", body: formData });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error?.message || "Upload ke Cloudinary gagal.");

  return {
    url: result.secure_url,
    publicId: result.public_id,
    resourceType,
    name: file.name,
    type: file.type
  };
}

async function removeStoredFile(publicId, resourceType) {
  if (!publicId) return;
  try {
    await callAdminApi("/api/cloudinary-delete", { publicId, resourceType: resourceType || "image" });
  } catch (error) {
    console.warn("File lama tidak terhapus di Cloudinary:", error);
  }
}

async function renderContentManager(collectionName) {
  const isNews = collectionName === "news";
  const heading = isNews ? "Tambah berita" : "Tambah kegiatan";
  content.innerHTML = `
    <form class="data-form cms-form" id="cmsForm">
      <h3>${heading}</h3>
      <label>${isNews ? "Tanggal" : "Tanggal kegiatan (opsional)"}
        <input name="date" type="date" ${isNews ? "required" : ""}>
      </label>
      <label>Judul
        <input name="title" maxlength="120" required placeholder="${isNews ? "Judul berita" : "Nama kegiatan"}">
      </label>
      ${isNews ? `
        <label>Ringkasan
          <textarea name="summary" rows="3" maxlength="500" required placeholder="Ringkasan singkat yang tampil di daftar berita"></textarea>
        </label>
        <label>Isi lengkap berita
          <textarea name="content" rows="6" maxlength="5000" required placeholder="Isi berita untuk popup Read More"></textarea>
        </label>
        <label>Gambar berita (opsional)
          <input name="imageFile" type="file" accept="image/*">
        </label>
        <label>Dokumen PDF (opsional)
          <input name="pdfFile" type="file" accept="application/pdf,.pdf">
        </label>
      ` : `
        <label>Deskripsi kegiatan
          <textarea name="description" rows="4" maxlength="2000" required placeholder="Deskripsi yang tampil di slider Our Activity"></textarea>
        </label>
        <label>Foto kegiatan
          <input name="imageFile" type="file" accept="image/*" required>
        </label>
      `}
      <div class="cms-actions">
        <button class="primary-btn" type="submit" id="saveContentBtn">Simpan ${isNews ? "News" : "Activity"}</button>
        <button class="secondary-btn" type="button" id="cancelEditBtn" hidden>Batal edit</button>
      </div>
      <p class="form-message" id="cmsMessage" role="status"></p>
    </form>
    <div class="cms-list-heading"><h3>Konten tersimpan</h3><button class="secondary-btn" id="refreshContentBtn" type="button">Refresh</button></div>
    <div id="cmsItems" class="cms-items"><p class="muted-note">Memuat...</p></div>`;

  const form = document.getElementById("cmsForm");
  const message = document.getElementById("cmsMessage");
  const saveBtn = document.getElementById("saveContentBtn");
  const cancelBtn = document.getElementById("cancelEditBtn");
  const itemsBox = document.getElementById("cmsItems");
  let editing = null;

  function resetEditor() {
    editing = null; form.reset();
    form.querySelector("h3").textContent = heading;
    saveBtn.textContent = `Simpan ${isNews ? "News" : "Activity"}`;
    cancelBtn.hidden = true; message.textContent = "";
  }
  cancelBtn.addEventListener("click", resetEditor);

  async function loadItems() {
    const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    itemsBox.replaceChildren();
    if (snap.empty) {
      itemsBox.innerHTML = '<p class="empty-state">Belum ada konten. Tambahkan konten melalui formulir di atas.</p>';
      return;
    }
    snap.forEach((record) => {
      const data = record.data();
      const card = document.createElement("article");
      card.className = "cms-item";
      const text = document.createElement("div");
      text.className = "cms-item-copy";
      const h = document.createElement("strong"); h.textContent = data.title || "(Tanpa judul)";
      const p = document.createElement("p"); p.textContent = isNews ? (data.summary || "") : (data.description || "");
      const meta = document.createElement("small"); meta.textContent = data.date || "Tanpa tanggal";
      text.append(h, p, meta);
      if (data.imageUrl) {
        const img = document.createElement("img"); img.className = "cms-thumb";
        img.src = data.imageUrl; img.alt = data.title || "Foto konten"; card.append(img);
      }
      const actions = document.createElement("div"); actions.className = "cms-item-actions";
      const edit = document.createElement("button"); edit.className = "secondary-btn"; edit.type = "button"; edit.textContent = "Edit";
      const del = document.createElement("button"); del.className = "delete-btn"; del.type = "button"; del.textContent = "Hapus";
      edit.addEventListener("click", () => {
        editing = { id: record.id, data };
        form.elements.date.value = data.dateInput || "";
        form.elements.title.value = data.title || "";
        if (isNews) {
          form.elements.summary.value = data.summary || "";
          form.elements.content.value = data.content || "";
        } else form.elements.description.value = data.description || "";
        form.querySelector("h3").textContent = "Edit konten";
        saveBtn.textContent = "Simpan perubahan";
        cancelBtn.hidden = false;
        message.textContent = "Mode edit aktif. Pilih file baru hanya jika ingin mengganti file lama.";
        form.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      del.addEventListener("click", async () => {
        if (!confirm(`Hapus "${data.title || "konten ini"}"?`)) return;
        del.disabled = true;
        try {
          await deleteDoc(doc(db, collectionName, record.id));
          await removeStoredFile(data.imagePublicId, data.imageResourceType);
          await removeStoredFile(data.pdfPublicId, data.pdfResourceType);
          await loadItems();
          if (editing?.id === record.id) resetEditor();
        } catch (error) {
          console.error(error); alert("Gagal menghapus. Periksa Firestore Rules dan konfigurasi Cloudinary."); del.disabled = false;
        }
      });
      actions.append(edit, del); card.append(text, actions); itemsBox.append(card);
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    saveBtn.disabled = true; message.classList.remove("is-error"); message.textContent = "Mengunggah ke Cloudinary dan menyimpan...";
    try {
      const old = editing?.data || {};
      const imageFile = form.elements.imageFile?.files?.[0] || null;
      const pdfFile = isNews ? (form.elements.pdfFile.files[0] || null) : null;
      if (imageFile && !imageFile.type.startsWith("image/")) throw new Error("File foto harus berupa gambar.");
      if (pdfFile && pdfFile.type !== "application/pdf") throw new Error("Dokumen harus berupa PDF.");
      const image = imageFile ? await uploadFile(imageFile, `${collectionName}/images`) : null;
      const pdf = pdfFile ? await uploadFile(pdfFile, `${collectionName}/documents`) : null;
      const payload = {
        title: form.elements.title.value.trim(),
        dateInput: form.elements.date.value,
        date: form.elements.date.value ? new Date(`${form.elements.date.value}T00:00:00`).toLocaleDateString("id-ID", {day:"2-digit",month:"2-digit",year:"2-digit"}) : "",
        imageUrl: image?.url || old.imageUrl || "",
        imagePublicId: image?.publicId || old.imagePublicId || "",
        imageResourceType: image?.resourceType || old.imageResourceType || "",
        updatedAt: serverTimestamp()
      };
      if (isNews) {
        payload.summary = form.elements.summary.value.trim();
        payload.content = form.elements.content.value.trim();
        payload.pdfUrl = pdf?.url || old.pdfUrl || "";
        payload.pdfPublicId = pdf?.publicId || old.pdfPublicId || "";
        payload.pdfResourceType = pdf?.resourceType || old.pdfResourceType || "";
      } else payload.description = form.elements.description.value.trim();

      if (editing) {
        await updateDoc(doc(db, collectionName, editing.id), payload);
        if (image && old.imagePublicId) await removeStoredFile(old.imagePublicId, old.imageResourceType);
        if (pdf && old.pdfPublicId) await removeStoredFile(old.pdfPublicId, old.pdfResourceType);
        message.textContent = "Perubahan berhasil disimpan.";
      } else {
        await addDoc(collection(db, collectionName), { ...payload, createdAt: serverTimestamp(), createdBy: currentUser.uid });
        message.textContent = "Berhasil diterbitkan dan akan tampil di website utama.";
      }
      const successText = editing ? "Perubahan berhasil disimpan." : "Berhasil diterbitkan.";
      resetEditor();
      message.textContent = successText;
      await loadItems();
    } catch (error) {
      console.error(error); message.textContent = error.message || "Gagal menyimpan konten. Periksa Firebase Rules.";
      message.classList.add("is-error");
    } finally { saveBtn.disabled = false; }
  });

  document.getElementById("refreshContentBtn").addEventListener("click", loadItems);
  await loadItems();
}

async function renderMessages(collectionName) {
  const snap = await getDocs(query(collection(db, collectionName), orderBy("createdAt", "desc")));
  if (snap.empty) { content.innerHTML = '<p class="empty-state">Belum ada pesan.</p>'; return; }
  const wrapper = document.createElement("div"); wrapper.className = "message-list";
  snap.forEach((item) => {
    const data = item.data();
    const card = document.createElement("article"); card.className = "message-card";
    const heading = document.createElement("div"); heading.className = "message-heading";
    const name = document.createElement("strong"); name.textContent = data.nama || data.name || data.email || "Pengunjung";
    const remove = document.createElement("button"); remove.className = "delete-btn"; remove.textContent = "Hapus"; remove.type = "button";
    heading.append(name, remove);
    const meta = document.createElement("p"); meta.className = "message-meta"; meta.textContent = [data.kelas, data.email].filter(Boolean).join(" • ");
    const body = document.createElement("p"); body.className = "message-body"; body.textContent = data.pesan || data.message || data.subject || "(Pesan kosong)";
    card.append(heading); if (meta.textContent) card.append(meta); card.append(body);
    remove.addEventListener("click", async () => {
      if (!confirm("Hapus pesan ini?")) return;
      try { await deleteDoc(doc(db, collectionName, item.id)); card.remove(); }
      catch (error) { console.error(error); alert("Gagal menghapus pesan."); }
    });
    wrapper.append(card);
  });
  content.replaceChildren(wrapper);
}
