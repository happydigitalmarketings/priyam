
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


    let fileBuffer = null;


    // Parse the form and buffer the file in memory, resolving only after file is fully buffered
    await new Promise((resolve, reject) => {
      form.on("file", (field, file) => {
        const chunks = [];
        file.on("data", (chunk) => {
          chunks.push(chunk);
        });
        file.on("end", () => {
          fileBuffer = Buffer.concat(chunks);
          resolve(); // Only resolve after file is fully buffered
        });
        file.on("error", (err) => {
          reject(err);
        });
      });
      form.parse(req, (err) => {
        if (err) reject(err);
        // Do not resolve here; wait for file 'end' event
      });
    });

    if (!fileBuffer || !fileBuffer.length) {
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
