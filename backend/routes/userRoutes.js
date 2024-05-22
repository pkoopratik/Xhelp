import express from "express";
import { followUnfollowUser, getUserProfile, getSuggestedUser, loginUser, logoutUser, signupUser, updateUser, freezeAccount, getFollower, getFollowing } from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js"

const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUser);
router.get("/:username/followers", protectRoute, getFollower);
router.get("/:username/following", protectRoute, getFollowing);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.put("/update/:id", protectRoute, updateUser);
router.put("/freeze", protectRoute, freezeAccount);

export default router; 
