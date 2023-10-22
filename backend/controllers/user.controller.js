import UserModel from "../models/user.model.js";
import mongoose from "mongoose";
import { Types } from "mongoose";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-motDePasse");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get one user
export const getUser = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID Unknown" });
  }
  try {
    const user = await UserModel.findById(req.params.id).select("-motDePasse");
    if (!user) {
      return res.status(400).json({ message: "ID Unknown" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID Unknown" });
  }
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, _id: req.params.id },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID Unknown" });
  }
  try {
    await UserModel.findByIdAndRemove(req.params.id).exec();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// follow a user
export const followUser = async (req, res) => {
  try {
    if (
      !Types.ObjectId.isValid(req.params.id) ||
      !Types.ObjectId.isValid(req.body.idToFollow)
    ) {
      return res.status(400).send("ID Unknown");
    }
    // Add to followers list
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { abonnements: req.body.idToFollow } },
      { new: true, upsert: true }
    );

    if (!user) {
      return res.status(404).send("User not found");
    }
    // Add to following list
    const followedUser = await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { abonnés: req.params.id } },
      { new: true, upsert: true }
    );

    if (!followedUser) {
      return res.status(404).send("Followed user not found");
    }

    return res.status(201).json({ user, followedUser });
  } catch (error) {
    console.error("Error while following user:", error);
    return res.status(500).json(error);
  }
};

// unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    if (
      !Types.ObjectId.isValid(req.params.id) ||
      !Types.ObjectId.isValid(req.body.idToUnfollow)
    ) {
      return res.status(400).send("ID Unknown");
    }
    // remove from followers list
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { abonnements: req.body.idToUnfollow } },
      { new: true }
    );

    if (!user) {
      return res.status(404).send("User not found");
    }
    // remove from following list
    const unfollowedUser = await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      { $pull: { abonnés: req.params.id } },
      { new: true }
    );

    if (!unfollowedUser) {
      return res.status(404).send("Unfollowed user not found");
    }

    return res.status(200).json({ user, unfollowedUser });
  } catch (error) {
    console.error("Error while unfollowing user:", error);
    return res.status(500).json(error);
  }
};