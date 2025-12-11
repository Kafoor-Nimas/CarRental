import express from "express";
import { protect } from "../middleware/auth.js";
import { addCar, changeRoleToOwner } from "../controllers/ownerController.js";
import upload from "../configs/cloudinary.js";
 

const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner);

// FIX: Run 'protect' FIRST, then 'upload'
ownerRouter.post("/add-car", protect, upload.single("image"), addCar);

export default ownerRouter;