import express from "express";
import { signUp, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

// Auth API
router.post("/register", signUp);           // Register a user
router.post("/login", login);               // Login a user
router.get("/logout", logout);              // Logout a user

export default router;