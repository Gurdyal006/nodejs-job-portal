import express from "express";
import userAuth from "../middlewares/authController.js";
import { updateUserController } from "../controllers/userController.js";

// router objects
const router = express.Router();

// update User || PUT
router.put("/update-user/:id", userAuth, updateUserController);

export default router;
