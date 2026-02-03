import express from "express";
import { AuthController } from "../controllers/Auth.controller.js";
const router = express.Router();
const authController = new AuthController();

// router.post("/register",authController.register.bind(authController)); there are two way to write this 
router.post("/register",(req,res)=>authController.register(req,res));
export default router;