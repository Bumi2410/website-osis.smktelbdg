# Instalasi Login & Admin OSIS

## File
Salin file-file ini ke folder yang sama dengan website:
- `login.html`
- `login.js`
- `admin.html`
- `admin.js`
- `admin.css`
- `firebase-config.js`

Jangan hapus `index.html`, `script.js`, atau `style.css` yang sudah ada.

## 1. Aktifkan Firebase Authentication
1. Buka Firebase Console: https://console.firebase.google.com/
2. Pilih project `osis-kritik-saran`.
3. Buka Authentication > Sign-in method.
4. Aktifkan Email/Password.

## 2. Buat akun admin
1. Buka Authentication > Users > Add user.
2. Masukkan email admin dan password yang kuat.
3. Setelah akun dibuat, salin UID akun tersebut.

## 3. Tandai akun sebagai admin
1. Buka Firestore Database.
2. Buat collection bernama `admins`.
3. Buat document dengan Document ID persis UID dari langkah 2.
4. Tambahkan field contoh: `role` (string) = `admin`.

Penting: Document ID harus sama persis dengan UID akun Firebase Authentication.

## 4. Pasang Firestore Rules
1. Buka Firestore Database > Rules.
2. Ganti rules dengan isi file `firestore.rules`.
3. Klik Publish.

Jangan menggunakan rules yang mengizinkan semua orang membaca/menulis database.

## 5. Pasang file ke website
Upload keenam file ke folder/root yang sama dengan `index.html`, lalu deploy ulang ke Vercel.

## 6. Buka halaman admin
- Login: `https://DOMAIN-WEBSITE-KAMU/login.html`
- Dashboard: otomatis terbuka setelah login berhasil.

Masuk menggunakan email dan password yang dibuat di Firebase Authentication.

## 7. Tentang menu
- Dashboard: jumlah dokumen di `news`, `activities`, dan `kritik_saran`.
- Upload News: menyimpan dokumen ke koleksi `news`.
- Upload Activity: menyimpan dokumen ke koleksi `activities`.
- Suggestion: membaca dan menghapus dokumen `kritik_saran`.
- Inbox: membaca dan menghapus dokumen `inbox` (opsional; perlu formulir inbox terpisah agar terisi).

Catatan: Upload News dan Upload Activity pada paket ini sudah menyimpan data ke Firestore. Agar kontennya otomatis muncul di halaman utama website, bagian `script.js` yang saat ini menampilkan array berita/kegiatan perlu dihubungkan ke koleksi `news` dan `activities`. Itu tahap integrasi berikutnya.

## 8. Catatan keamanan
- Jangan pernah memasukkan Firebase Admin SDK private key ke file website.
- `firebase-config.js` berisi konfigurasi web Firebase yang memang digunakan di browser. Batasi API key dengan HTTP referrer di Google Cloud Console bila sudah siap.
- Pastikan hanya UID admin yang memiliki dokumen di collection `admins`.
