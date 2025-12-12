import { v2 as cloudinary } from "cloudinary";
import { IncomingForm } from "formidable";
import fs from "fs";
import os from "os";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const tmpDir = os.tmpdir();

  try {
    const form = new IncomingForm({
      uploadDir: tmpDir,
      keepExtensions: true,
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    // Get the file (formidable v3+ returns arrays)
    const fileArray = files.image || files.file;
    if (!fileArray || fileArray.length === 0) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;
    
    // ✅ Use 'filepath' for v2, 'path' for v3+ (fallback to both)
    const filePath = file.filepath || file.path;
    
    if (!filePath) {
      return res.status(400).json({ message: "Invalid file path" });
    }

    const fileBuffer = fs.readFileSync(filePath);

    // Get the type field (also might be an array in v3+)
    const type = Array.isArray(fields.type) ? fields.type[0] : fields.type;
    const folder = type === "banner" ? "minikki/banners" : "minikki/products";

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(fileBuffer);
    });

    // Cleanup temp file
    fs.unlinkSync(filePath);

    return res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Upload failed", error: error?.message || "Unknown error" });
  }
}