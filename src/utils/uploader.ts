import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.APP_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.APP_CLOUDINARY_API_KEY,
  api_secret: process.env.APP_CLOUDINARY_SECRET_KEY,
});

// Multer storage (in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper to upload buffer to Cloudinary and return the result
const uploadToCloudinary = (fileBuffer: Buffer, filename: string) => {
  return new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", public_id: filename },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

export { upload, uploadToCloudinary };
