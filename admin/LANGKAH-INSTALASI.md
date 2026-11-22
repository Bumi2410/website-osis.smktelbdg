# Langkah Instalasi Admin OSIS

## Firebase Authentication dan Firestore
1. Aktifkan Authentication → Email/Password di Firebase.
2. Buat user admin di Authentication → Users.
3. Salin UID user.
4. Di Firestore buat dokumen `admins/{UID}` dengan field `role` (string) = `admin`.
5. Publish rules dari `admin/firestore.rules`.

## Cloudinary + Vercel
Ikuti seluruh langkah pada `PANDUAN-CMS.md`, terutama pengaturan Environment Variables Vercel. Jangan pernah menyimpan API Secret atau Firebase service account JSON di GitHub.

## URL
- Login: `/admin/login`
- Dashboard: `/admin/dashboard`

Firebase Storage tidak diperlukan. File News/Activity disimpan di Cloudinary; metadata disimpan di Firestore.
