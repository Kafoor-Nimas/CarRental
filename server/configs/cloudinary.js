import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "cars", // The folder name in your Cloudinary dashboard
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    // Transform images to WebP and resize to width 1280 automatically
    format: "webp", 
    transformation: [{ width: 1280, crop: "limit", quality: "auto" }],
  },
});

// 3. Initialize Multer
const upload = multer({ storage: storage });

export default upload;