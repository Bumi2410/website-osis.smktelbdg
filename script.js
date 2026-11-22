/* =========================================================
   OSIS SMK TELKOM BANDUNG - SCRIPT (Vanilla JavaScript)
   Bagian:
   1. DATA (edit di sini untuk mengganti isi website)
   2. Navbar & menu
   3. Hero slider
   4. Divisions carousel
   5. Members carousel
   6. News + popup detail
   7. Animasi muncul saat scroll
   ========================================================= */

/* ---------- 1. DATA ----------
   Semua data di bawah adalah CONTOH SEMENTARA (placeholder).
   Isi "image" dengan path gambar, mis. "assets/hero/slide-1.jpg".
   Jika "image" kosong, kotak placeholder berlabel akan ditampilkan. */

const HERO_SLIDES = [
  { label: "Gambar 1", image: "assets/hero/slide1.jpeg" },
  { label: "Gambar 2", image: "assets/hero/slide2.jpeg" },
  { label: "Gambar 3", image: "assets/hero/slide3.jpeg" },
  { label: "Gambar 4", image: "assets/hero/slide4.jpeg" },
  { label: "Gambar 5", image: "assets/hero/slide5.jpeg" },
  { label: "Gambar 6", image: "assets/hero/slide6.jpeg" },
  { label: "Gambar 7", image: "assets/hero/slide7.jpeg" },
  { label: "Gambar 8", image: "assets/hero/slide8.jpeg" },
  { label: "Gambar 9", image: "assets/hero/slide9.jpeg" },
  { label: "Gambar 10", image: "assets/hero/slide10.jpeg" },
];

// Deskripsi Sekbid 2-10 adalah contoh umum, sesuaikan dengan program OSIS yang sebenarnya.
const DIVISIONS = [
  { name: "Sekbid 1", image: "", desc: "merupakan bidang yang berfokus pada peningkatan keimanan, ketakwaan, dan pembentukan karakter religius siswa melalui berbagai kegiatan keagamaan. Berperan dalam menciptakan lingkungan sekolah yang harmonis, toleran, dan berakhlak mulia." },
  { name: "Sekbid 2", image: "", desc: "merupakan bidang yang berfokus pada pembinaan budi pekerti luhur dan akhlak mulia. Berperan dalam menumbuhkan sikap disiplin, sopan santun, serta budaya tertib di lingkungan sekolah." },
  { name: "Sekbid 3", image: "", desc: "merupakan bidang yang berfokus pada pembinaan kepribadian unggul, wawasan kebangsaan, dan bela negara. Berperan dalam menumbuhkan rasa cinta tanah air dan semangat nasionalisme siswa." },
  { name: "Sekbid 4", image: "", desc: "merupakan bidang yang berfokus pada pembinaan prestasi akademik, seni, dan olahraga sesuai bakat dan minat. Berperan dalam mewadahi siswa untuk berkompetisi dan mengembangkan potensinya." },
  { name: "Sekbid 5", image: "", desc: "merupakan bidang yang berfokus pada pembinaan demokrasi, hak asasi manusia, pendidikan politik, lingkungan hidup, dan kepekaan sosial. Berperan dalam melatih kepemimpinan dan kepedulian siswa." },
  { name: "Sekbid 6", image: "", desc: "merupakan bidang yang berfokus pada pembinaan kreativitas, keterampilan, dan kewirausahaan. Berperan dalam mendorong siswa untuk berkarya, mandiri, dan berjiwa wirausaha." },
  { name: "Sekbid 7", image: "", desc: "merupakan bidang yang berfokus pada pembinaan kualitas jasmani, kesehatan, dan gizi. Berperan dalam menciptakan budaya hidup sehat dan lingkungan sekolah yang bersih." },
  { name: "Sekbid 8", image: "", desc: "merupakan bidang yang berfokus pada pembinaan sastra dan budaya. Berperan dalam melestarikan budaya serta mengembangkan apresiasi dan kreasi seni siswa." },
  { name: "Sekbid 9", image: "", desc: "merupakan bidang yang berfokus pada pembinaan teknologi informasi dan komunikasi. Berperan dalam mengelola media, publikasi, dan pemanfaatan teknologi untuk kegiatan siswa." },
  { name: "Sekbid 10", image: "", desc: "merupakan bidang yang berfokus pada pembinaan komunikasi dalam bahasa Inggris. Berperan dalam meningkatkan kemampuan berbahasa asing siswa melalui berbagai kegiatan." },
];

// Ganti name, division, dan image dengan data anggota yang sebenarnya.
const MEMBERS = Array.from({ length: 12 }, (_, i) => ({
  label: "Orang " + (i + 1),
  name: "Nama",
  division: "Divisi",
  image: "",
}));

// Tanggal memakai format DD/MM/YY. Ganti seluruh isi dengan berita asli.
const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure.";
const NEWS = [
  {
    date: "22/11/26",
    title: "Welcome to OSIS SMK Telkom Bandung",
    summary: "Selamat datang di website resmi OSIS SMK Telkom Bandung. Temukan informasi, kegiatan, dan berbagai program organisasi siswa di sini.",
    content: "Website resmi OSIS SMK Telkom Bandung hadir sebagai media informasi dan komunikasi bagi seluruh siswa. Melalui website ini, siswa dapat mengenal organisasi, melihat kegiatan, serta mendapatkan informasi terbaru mengenai OSIS."
  },
  {
    date: "20/11/26",
    title: "Kampanye Calon Ketua OSIS",
    summary: "Kampanye calon ketua OSIS dimulai untuk memperkenalkan visi dan misi mereka.",
    content: "Ke tiga calon ketua OSIS telah memulai kampanye mereka untuk memperkenalkan visi dan misi yang mereka bawa."
  },
  {
    date: "10/11/26",
    title: "Kegiatan Bulan Bahasa",
    summary: "Mendorong perkembangan dan ketertarikan siswa dalam bidang bahasa.",
    content: "Kegiatan bulan bahasa bertujuan untuk meningkatkan keterampilan berbahasa siswa, baik dalam hal menulis, membaca, maupun berbicara dan juga meningkatkan pemahaman tentang budaya dan literatur."
  },
  {
    date: "27/10/26",
    title: "Pengumuman Hasil Seleksi OSIS",
    summary: "Hasil seleksi calon anggota OSIS telah diumumkan,silahkan cek informasi lebih lanjut di Read More.",
    content: "Berikut adalah hasil seleksi calon anggota OSIS.",
    pdf: "assets/documents/HASIL_SELEKSI_OSIS_2026.pdf",
  },
  {
    date: "17/10/26",
    title: "LDKS Calon Anggota OSIS!",
    summary: "Dalam membangun kemampuan kepemimpinan dan keterampilan sosial siswa, OSIS menyelenggarakan LDKS.",
    content: "Yang diharapkan menjadi wadah untuk belajar memimpin, berkolaborasi, dan menciptakan perubahan positif. Masa depan sekolah dibangun melalui kontribusi dan semangat seluruh siswanya."
  },
  {
    date: "09/09/26",
    title: "Open Recruitment Anggota OSIS",
    summary: "Kesempatan bagi siswa untuk bergabung dan mengembangkan kemampuan kepemimpinan, kerja sama, serta kreativitas.",
    content: "Open Recruitment OSIS merupakan kesempatan bagi siswa untuk ikut berkontribusi dalam organisasi. Informasi mengenai persyaratan, tahapan seleksi, dan jadwal pendaftaran akan diumumkan melalui kanal resmi sekolah."
  },
];

/* ---------- Fungsi bantu ---------- */
const $ = (selector) => document.querySelector(selector);

// Mengisi sebuah kotak dengan gambar (jika ada) atau label placeholder
function fillMedia(el, image, label) {
  el.textContent = "";
  if (image) {
    const img = document.createElement("img");
    img.src = image;
    img.alt = label;
    el.appendChild(img);
  } else {
    el.textContent = label;
  }
}

// Membuat titik indikator; onSelect dipanggil dengan indeks titik yang diklik
function buildDots(container, count, onSelect, testIdPrefix) {
  for (let i = 0; i < count; i++) {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", "Ke nomor " + (i + 1));
    dot.dataset.testid = testIdPrefix + "-" + i;
    dot.addEventListener("click", () => onSelect(i));
    container.appendChild(dot);
  }
  return (active) =>
    [...container.children].forEach((d, i) => d.classList.toggle("is-active", i === active));
}

/* ---------- 2. NAVBAR & MENU ---------- */
(function initNavbar() {
  const navbar = $("#navbar");
  const toggle = $("#menuToggle");
  const panel = $("#menuPanel");

  // Bayangan navbar saat halaman digulir
  window.addEventListener("scroll", () => navbar.classList.toggle("is-scrolled", window.scrollY > 10), { passive: true });

  function setMenu(open) {
    panel.classList.toggle("is-open", open);
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open);
  }

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    setMenu(!panel.classList.contains("is-open"));
  });
  // Tutup menu setelah link diklik, klik di luar, atau tombol Escape
  panel.addEventListener("click", (e) => e.target.tagName === "A" && setMenu(false));
  document.addEventListener("click", (e) => !panel.contains(e.target) && setMenu(false));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  // Tandai menu navbar sesuai section yang sedang terlihat
  const links = document.querySelectorAll(".nav-link");
  const spy = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + entry.target.id));
    }),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  document.querySelectorAll("main section").forEach((s) => spy.observe(s));
})();

/* ---------- 3. HERO SLIDER ---------- */
(function initHero() {
  const slider = $("#heroSlider");
  const track = $("#heroTrack");
  let index = 0;
  let timer;

  HERO_SLIDES.forEach((slide) => {
    const el = document.createElement("div");
    el.className = "hero__slide";
    fillMedia(el, slide.image, slide.label);
    track.appendChild(el);
  });

  const setDots = buildDots($("#heroDots"), HERO_SLIDES.length, goTo, "hero-dot");

  function goTo(i) {
    index = (i + HERO_SLIDES.length) % HERO_SLIDES.length; // berputar dari akhir ke awal
    track.style.transform = "translateX(" + -index * 100 + "%)";
    setDots(index);
    restartAuto();
  }

  // Ganti slide otomatis setiap 5 detik
  function restartAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), 5000);
  }

  $("#heroPrev").addEventListener("click", () => goTo(index - 1));
  $("#heroNext").addEventListener("click", () => goTo(index + 1));

  // Swipe dengan jari pada layar sentuh
  let startX = 0;
  slider.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
  slider.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40) goTo(index + (diff < 0 ? 1 : -1));
  });

  // Efek 3D halus: slider sedikit miring mengikuti kursor (hanya perangkat dengan mouse)
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (window.matchMedia("(hover: hover)").matches && !reduceMotion) {
    slider.addEventListener("mousemove", (e) => {
      const r = slider.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      slider.style.transform = "rotateY(" + x * 5 + "deg) rotateX(" + -y * 5 + "deg)";
    });
    slider.addEventListener("mouseleave", () => (slider.style.transform = ""));
  }

  goTo(0);
})();

/* ---------- 4. DIVISIONS CAROUSEL ---------- */
(function initDivisions() {
  const slide = $("#divisionSlide");
  const image = $("#divisionImage");
  const desc = $("#divisionDesc");
  const name = $("#divisionName");
  let index = 0;
  let busy = false;

  const setDots = buildDots($("#divisionDots"), DIVISIONS.length, (i) => goTo(i, i >= index ? "next" : "prev"), "division-dot");

  function render() {
    const d = DIVISIONS[index];
    fillMedia(image, d.image, "Gambar Divisi");
    desc.innerHTML = "";
    const strong = document.createElement("strong");
    strong.textContent = d.name;
    desc.append(strong, " " + d.desc);
    name.textContent = d.name;
    setDots(index);
  }

  // Transisi halus: konten lama memudar keluar, lalu konten baru memudar masuk
  function goTo(i, direction) {
    if (busy) return;
    busy = true;
    slide.classList.add("is-leaving-" + direction);
    setTimeout(() => {
      index = (i + DIVISIONS.length) % DIVISIONS.length;
      render();
      slide.classList.remove("is-leaving-next", "is-leaving-prev");
      busy = false;
    }, 300);
  }

  $("#divPrev").addEventListener("click", () => goTo(index - 1, "prev"));
  $("#divNext").addEventListener("click", () => goTo(index + 1, "next"));

  // Swipe pada layar sentuh
  let startX = 0;
  slide.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
  slide.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40) diff < 0 ? goTo(index + 1, "next") : goTo(index - 1, "prev");
  });

  render();
})();

/* ---------- 5. MEMBERS CAROUSEL ---------- */
(function initMembers() {
  const track = $("#membersTrack");

  MEMBERS.forEach((m, i) => {
    const card = document.createElement("article");
    card.className = "member";
    card.dataset.testid = "member-card-" + i;

    const photo = document.createElement("div");
    photo.className = "frame member__photo";
    fillMedia(photo, m.image, m.label);

    const name = document.createElement("h3");
    name.className = "member__name";
    name.textContent = m.name;

    const division = document.createElement("p");
    division.className = "member__division";
    division.textContent = m.division;

    card.append(photo, name, division);
    track.appendChild(card);
  });

  // Geser sejauh satu kartu. Swipe jari ditangani langsung oleh CSS (overflow-x + scroll-snap).
  function move(direction) {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = track.firstElementChild.offsetWidth + gap;
    const maxScroll = track.scrollWidth - track.clientWidth;

    if (direction > 0 && track.scrollLeft >= maxScroll - 5) track.scrollTo({ left: 0 });          // dari akhir kembali ke awal
    else if (direction < 0 && track.scrollLeft <= 5) track.scrollTo({ left: maxScroll });       // dari awal ke akhir
    else track.scrollBy({ left: direction * step });
  }

  $("#memPrev").addEventListener("click", () => move(-1));
  $("#memNext").addEventListener("click", () => move(1));
})();

/* ---------- 6. NEWS + POPUP DETAIL ---------- */
(function initNews() {
  const list = $("#newsList");
  const modal = $("#newsModal");

  NEWS.forEach((n, i) => {
    const item = document.createElement("article");
    item.className = "news-item";
    item.dataset.testid = "news-item-" + i;

    const date = document.createElement("time");
    date.className = "news-item__date";
    date.textContent = n.date;

    const body = document.createElement("div");
    const title = document.createElement("h3");
    title.className = "news-item__title";
    title.textContent = n.title;
    const summary = document.createElement("p");
    summary.className = "news-item__summary";
    summary.textContent = n.summary;
    const more = document.createElement("button");
    more.className = "news-item__more";
    more.textContent = "Read More";
    more.dataset.testid = "news-read-more-" + i;
    more.addEventListener("click", () => openModal(n));

    body.append(title, summary, more);
    item.append(date, body);
    list.appendChild(item);
  });

function openModal(news) {
  $("#modalDate").textContent = news.date;
  $("#modalTitle").textContent = news.title;
  $("#modalBody").textContent = news.content;

  const pdfButton = $("#modalPdf");

  if (news.pdf) {
    pdfButton.href = news.pdf;
    pdfButton.style.display = "inline-block";
  } else {
    pdfButton.style.display = "none";
    pdfButton.removeAttribute("href");
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  $("#modalClose").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => e.target === modal && closeModal()); // klik area gelap
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeModal());
})();

/* ---------- 7. ANIMASI MUNCUL SAAT SCROLL ---------- */
(function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // cukup sekali
      }
    }),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();

// JAM DIGITAL
function updateClock() {
  const now = new Date();

  const time = now.toLocaleTimeString("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  document.getElementById("digitalClock").textContent = time;
}

updateClock();
setInterval(updateClock, 1000);
