import { db } from "./firebase-config.js";
import {
  collection, onSnapshot, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const $ = (selector) => document.querySelector(selector);

function formatDate(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value.toDate) return value.toDate().toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "2-digit" });
  return "";
}

// NEWS: jika Firestore sudah berisi berita, daftar statis digantikan oleh data admin.
onSnapshot(query(collection(db, "news"), orderBy("createdAt", "desc")), (snapshot) => {
  if (snapshot.empty) return; // pertahankan berita lama sebagai fallback jika koleksi masih kosong
  const list = $("#newsList");
  if (!list) return;
  list.replaceChildren();
  snapshot.forEach((record, index) => {
    const n = record.data();
    const item = document.createElement("article");
    item.className = "news-item";
    item.dataset.testid = `news-item-${index}`;
    const date = document.createElement("time");
    date.className = "news-item__date";
    date.textContent = n.date || formatDate(n.createdAt);
    const body = document.createElement("div");
    if (n.imageUrl) {
      const img = document.createElement("img");
      img.className = "news-item__image";
      img.src = n.imageUrl; img.alt = n.title || "Foto berita"; img.loading = "lazy";
      body.append(img);
    }
    const heading = document.createElement("h3");
    heading.className = "news-item__title"; heading.textContent = n.title || "";
    const summary = document.createElement("p");
    summary.className = "news-item__summary"; summary.textContent = n.summary || "";
    const more = document.createElement("button");
    more.className = "news-item__more"; more.textContent = "Read More";
    more.addEventListener("click", () => {
      $("#modalDate").textContent = n.date || formatDate(n.createdAt);
      $("#modalTitle").textContent = n.title || "";
      $("#modalBody").textContent = n.content || n.summary || "";
      const pdf = $("#modalPdf");
      if (n.pdfUrl) { pdf.href = n.pdfUrl; pdf.style.display = "inline-block"; pdf.textContent = "Baca Dokumen PDF"; }
      else { pdf.style.display = "none"; pdf.removeAttribute("href"); }
      const modal = $("#newsModal");
      modal.classList.add("is-open"); modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
    body.append(heading, summary, more);
    item.append(date, body); list.append(item);
  });
}, (error) => console.error("News Firestore:", error));

// OUR ACTIVITY: render memakai struktur dan kelas slider yang sudah dipakai website.
onSnapshot(query(collection(db, "activities"), orderBy("createdAt", "desc")), (snapshot) => {
  if (snapshot.empty) return; // aktivitas bawaan tetap tampil sampai admin menambahkan konten
  const track = $("#activityTrack");
  const dots = $("#activityDots");
  const title = $("#activityTitle");
  const description = $("#activityDescription");
  const number = $("#activityNumber");
  if (!track || !dots || !title || !description || !number) return;

  const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })).filter((x) => x.imageUrl);
  if (!items.length) return;
  let index = 0;
  let timer;
  function goTo(next) {
    index = (next + items.length) % items.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    title.textContent = items[index].title || "";
    description.textContent = items[index].description || "";
    number.textContent = `${String(index + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
    [...dots.children].forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), 5000);
  }
  track.replaceChildren(); dots.replaceChildren();
  items.forEach((activity) => {
    const slide = document.createElement("div"); slide.className = "activity__slide";
    const img = document.createElement("img"); img.src = activity.imageUrl; img.alt = activity.title || "Kegiatan OSIS"; img.loading = "lazy";
    slide.append(img); track.append(slide);
    const dot = document.createElement("button"); dot.setAttribute("aria-label", `Kegiatan ${dots.children.length + 1}`);
    dot.addEventListener("click", () => goTo([...dots.children].indexOf(dot)));
    dots.append(dot);
  });
  $("#activityPrev").onclick = () => goTo(index - 1);
  $("#activityNext").onclick = () => goTo(index + 1);
  goTo(0);
}, (error) => console.error("Activity Firestore:", error));
