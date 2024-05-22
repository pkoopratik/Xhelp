import express from "express";
import protectRoute from "../middlewares/protectRoute.js"
import { createPost, deletePost, getFeed, getPost, getTrending, getUserPosts, likeUnlikePost, replyToPost } from "../controllers/postControllers.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeed);
router.get("/trending", getTrending);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/reply/:id", protectRoute, replyToPost);

export default router; 
