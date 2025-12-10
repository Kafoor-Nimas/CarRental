import express from "express";
import {
  getUserData,
  loginUser,
  regiterUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", regiterUser);
userRouter.post("/login", loginUser);
userRouter.get("/data", protect, getUserData);

export default userRouter;
