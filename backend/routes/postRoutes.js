import express from "express";
import protectRoute from "../middlewares/protectRoute.js"
import { createPost, deletePost, getFeed, getPost, likeUnlikePost, replyToPost } from "../controllers/postControllers.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeed);
router.get("/:id", getPost);
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/reply/:id", protectRoute, replyToPost);

export default router; 
