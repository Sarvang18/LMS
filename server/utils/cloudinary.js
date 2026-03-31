import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({});

cloudinary.config({
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  cloud_name: process.env.CLOUD_NAME,
});

export const uploadMedia = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    if (!process.env.API_KEY || !process.env.API_SECRET) {
      return reject(new Error("CRITICAL ERROR: Cloudinary API_KEY or API_SECRET is secretly missing in your Render Environment Variables!"));
    }
    
    if (!fileBuffer) {
      return reject(new Error("CRITICAL ERROR: The file buffer is empty. Multer failed to parse the file properly."));
    }

    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.log("Cloudinary Upload Error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    stream.end(fileBuffer);
  });
};
export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
  }
};

export const deleteVideoFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (error) {
    console.log(error);
  }
}