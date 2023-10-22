import express from 'express';
import * as postController from '../controllers/post.controller.js';
import { checkUser, requireAuth } from '../middleware/auth.middleware.js';
import multer from 'multer'; // Use ES6 module import syntax
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

// router.get('/', postController.readPost);
router.post("/create-post", checkUser, upload.fields([{ name: "image", maxCount: 1 }, { name: "video" }]), postController.createPost);
router.get('/get-post/:id', postController.getPost);
router.get('/get-user-&-following-posts',checkUser, postController.getUserPostsAndFollowingPosts);
router.put('/:id', checkUser,upload.fields([{ name: "image", maxCount: 1 }, { name: "video"}]),postController.updatePost);
router.delete('/:id', checkUser,postController.deletePost);
//router.patch('/like-post/:id', checkUser, postController.likePost);
//router.patch('/unlike-post/:id', checkUser, postController.unlikePost);
router.post('/:groupId',checkUser, upload.fields([{ name: "image", maxCount: 1}, { name: "video" }]), postController.createGroupPost);
router.put('/aprrove-post/:groupId/:postId', checkUser, postController.approvePendingPost);
router.delete('/delete-post/:groupId/:postId', checkUser, postController.deleteGroupPost);
router.get('/:groupId/approved-posts', checkUser, postController.getApprovedGroupPosts);
router.get('/:groupId/pending-posts', checkUser, postController.getPendingGroupPosts);


export default router;
