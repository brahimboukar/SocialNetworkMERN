import express from "express";
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
} from "../controllers/user.controller.js";

const router = express.Router();

// User API
router.get("/", getAllUsers);                         // Get all users
router.get("/:id", getUser);                          // Get a user
router.put("/:id", updateUser);                       // Update a user
router.delete("/:id", deleteUser);                    // Delete a user
router.patch("/follow/:id", followUser);              // Follow a user
router.patch("/unfollow/:id", unfollowUser);          // Unfollow a user

export default router;