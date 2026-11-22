
const { cloudinary, initServices, requireAdmin, sendError } = require("./_utils");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method tidak diizinkan." });
  try {
    initServices();
    await requireAdmin(req);

    const { publicId, resourceType } = req.body || {};
    if (typeof publicId !== "string" ||
        !/^(news\/images|news\/documents|activities\/images)\/[a-zA-Z0-9._-]{1,180}$/.test(publicId)) {
      return res.status(400).json({ error: "File yang diminta tidak valid." });
    }
    if (!["image", "raw"].includes(resourceType)) {
      return res.status(400).json({ error: "Jenis file tidak valid." });
    }
    if (publicId.startsWith("news/documents/") !== (resourceType === "raw")) {
      return res.status(400).json({ error: "Jenis file tidak sesuai." });
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      type: "upload",
      invalidate: true
    });
    return res.status(200).json({ result: result.result });
  } catch (error) {
    return sendError(res, error);
  }
};
