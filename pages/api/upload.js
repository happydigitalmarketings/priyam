
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";

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

  try {

    const form = formidable({
      multiples: false,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      fileWriteStreamHandler: () => null, // Prevent writing to disk
    });

    let fileBuffer = Buffer.alloc(0);
    let fileInfo = null;

    form.on("fileBegin", (name, file) => {
      fileInfo = file;
    });

    form.on("data", (data) => {
      if (data && data.name === "file" && data.value) {
        fileBuffer = Buffer.concat([fileBuffer, data.value]);
      }
    });

    // Parse the form
    await new Promise((resolve, reject) => {
      form.parse(req, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    if (!fileBuffer.length) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Determine folder based on query parameter
    const folder = req.query.type === 'banner' ? 'minikki/banners' : 'minikki/products';

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(fileBuffer);
    });

    return res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Upload failed", error: error.message });
  }
}
