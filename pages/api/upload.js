import { v2 as cloudinary } from "cloudinary";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";

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

  let filePath = null;

  try {
    // ✅ Explicitly set to /tmp for Vercel
    const form = new IncomingForm({
      uploadDir: "/tmp",
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("Formidable parse error:", err);
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });

    console.log("Files received:", Object.keys(files));

    // Get the file (handle both v2 and v3 formats)
    const fileArray = files.image || files.file;
    if (!fileArray || (Array.isArray(fileArray) && fileArray.length === 0)) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;
    filePath = file.filepath || file.path;

    if (!filePath) {
      console.error("File path is undefined. File object:", file);
      return res.status(400).json({ message: "Invalid file path" });
    }

    console.log("File path:", filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ message: "Uploaded file not found" });
    }

    const fileBuffer = fs.readFileSync(filePath);
    console.log("File buffer size:", fileBuffer.length);

    // Get the type field
    const type = Array.isArray(fields.type) ? fields.type[0] : fields.type;
    const folder = type === "banner" ? "minikki/banners" : "minikki/products";

    console.log("Uploading to Cloudinary folder:", folder);

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("Cloudinary upload success:", result.secure_url);
            resolve(result);
          }
        }
      );
      stream.end(fileBuffer);
    });

    // Cleanup temp file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    // Cleanup on error
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupError) {
        console.error("Cleanup error:", cleanupError);
      }
    }

    return res.status(500).json({
      message: "Upload failed",
      error: error?.message || "Unknown error",
      details: error?.stack || "",
    });
  }
}