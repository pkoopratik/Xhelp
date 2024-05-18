import express from "express";
import { followUnfollowUser, getUserProfile, getSuggestedUser, loginUser, logoutUser, signupUser, updateUser, freezeAccount } from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js"

const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUser);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.put("/update/:id", protectRoute, updateUser);
router.put("/freeze", protectRoute, freezeAccount);

export default router; 
