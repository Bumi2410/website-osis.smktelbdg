
const admin = require("firebase-admin");
const { v2: cloudinary } = require("cloudinary");

function initServices() {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    throw new Error("Environment variable FIREBASE_SERVICE_ACCOUNT_JSON belum diatur.");
  }
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id
    });
  }
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Environment Variables Cloudinary belum lengkap.");
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

async function requireAdmin(req) {
  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer (.+)$/i);
  if (!match) {
    const error = new Error("Sesi login tidak ditemukan. Silakan login ulang.");
    error.status = 401;
    throw error;
  }
  const decoded = await admin.auth().verifyIdToken(match[1]);
  const adminDoc = await admin.firestore().collection("admins").doc(decoded.uid).get();
  if (!adminDoc.exists) {
    const error = new Error("Akun ini tidak memiliki akses admin.");
    error.status = 403;
    throw error;
  }
  return decoded;
}

function sendError(res, error) {
  console.error(error);
  res.status(error.status || 500).json({
    error: error.status ? error.message : "Terjadi kesalahan pada server. Periksa Environment Variables Vercel."
  });
}

module.exports = { admin, cloudinary, initServices, requireAdmin, sendError };
