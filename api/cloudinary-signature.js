
const { cloudinary, initServices, requireAdmin, sendError } = require("./_utils");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method tidak diizinkan." });
  try {
    initServices();
    await requireAdmin(req);

    const { folder, publicId, resourceType } = req.body || {};
    const allowedFolders = ["news/images", "news/documents", "activities/images"];
    if (!allowedFolders.includes(folder)) return res.status(400).json({ error: "Folder upload tidak valid." });
    if (!["image", "raw"].includes(resourceType)) return res.status(400).json({ error: "Jenis file tidak valid." });
    if (folder === "news/documents" && resourceType !== "raw") return res.status(400).json({ error: "Dokumen harus menggunakan tipe raw." });
    if (folder !== "news/documents" && resourceType !== "image") return res.status(400).json({ error: "Folder ini hanya menerima gambar." });
    if (typeof publicId !== "string" || !/^[a-zA-Z0-9._-]{1,140}$/.test(publicId)) {
      return res.status(400).json({ error: "Nama file tidak valid." });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const fullPublicId = `${folder}/${publicId}`;
    const params = { timestamp, public_id: fullPublicId };
    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);
    return res.status(200).json({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      timestamp,
      folder,
      publicId: fullPublicId,
      signature
    });
  } catch (error) {
    return sendError(res, error);
  }
};
