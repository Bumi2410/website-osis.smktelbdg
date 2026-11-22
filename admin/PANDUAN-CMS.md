# OSIS CMS — Cloudinary + Firebase Firestore

CMS mengelola News dan Our Activity. File gambar/PDF diunggah ke Cloudinary, sedangkan URL dan metadata konten disimpan di Firestore. Firebase Storage tidak digunakan.

## File penting
- `api/cloudinary-signature.js`: membuat signature upload setelah memverifikasi login dan hak admin.
- `api/cloudinary-delete.js`: menghapus file Cloudinary setelah memverifikasi admin.
- `api/_utils.js`: autentikasi Firebase Admin dan konfigurasi Cloudinary.
- `package.json`: dependency server Vercel.
- `admin/admin.js`: upload Cloudinary dan CRUD konten Firestore.

## 1. Siapkan Cloudinary
Ambil Cloud Name, API Key, dan API Secret dari Cloudinary Console.

## 2. Siapkan Firebase service account untuk server
1. Firebase Console → Project settings → Service accounts.
2. Pilih Generate new private key dan unduh file JSON.
3. Jangan pernah memasukkan file JSON ke folder website/GitHub atau mengirimkannya ke chat.
4. Buka file JSON secara lokal. Seluruh isi JSON akan dimasukkan ke Environment Variable Vercel bernama `FIREBASE_SERVICE_ACCOUNT_JSON`.

Project ID Firebase yang digunakan adalah `osis-kritik-saran`.

## 3. Tambahkan Environment Variables di Vercel
Vercel → Project OSIS → Settings → Environment Variables. Tambahkan:

- `CLOUDINARY_CLOUD_NAME` = Cloud Name
- `CLOUDINARY_API_KEY` = API Key
- `CLOUDINARY_API_SECRET` = API Secret
- `FIREBASE_SERVICE_ACCOUNT_JSON` = seluruh isi file service account JSON (satu nilai JSON lengkap)
- `FIREBASE_PROJECT_ID` = `osis-kritik-saran`

Pilih environment Production, Preview, dan Development sesuai kebutuhan. Jangan menaruh API Secret atau service account di file frontend maupun GitHub.

## 4. Deploy
Commit dan push perubahan ke branch yang terhubung ke Vercel. Vercel akan memasang dependency dari `package.json` dan membuat endpoint `/api/cloudinary-signature` serta `/api/cloudinary-delete`.

Setelah mengubah Environment Variables, lakukan Redeploy agar fungsi memakai nilai terbaru.

## 5. Firebase
- Firestore tetap digunakan untuk koleksi `admins`, `news`, `activities`, dan `kritik_saran`.
- Pastikan Firestore Rules dari `admin/firestore.rules` sudah dipublikasikan.
- Tidak perlu mengaktifkan Firebase Storage dan tidak perlu memasang Storage Rules.

## 6. Pengujian
1. Login melalui `/admin/login`.
2. Upload satu gambar News dan satu PDF.
3. Periksa konten di website utama.
4. Edit konten dengan file baru, lalu uji hapus.
5. Periksa Cloudinary Media Library dan Firestore.

## Catatan keamanan
- Hanya akun Firebase yang memiliki dokumen `admins/{UID}` dapat meminta signature atau menghapus file.
- Browser mengirim file langsung ke Cloudinary dengan signature sementara; API Secret tetap di server Vercel.
- Jangan pernah commit file service account JSON.
- Paket gratis Cloudinary memiliki kuota dan batas penggunaan. Pantau penggunaan di dashboard Cloudinary.
