import bcrypt from "bcryptjs";
import { v2 as cloudinary } from 'cloudinary';
import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAdSetCookie.js";
import mongoose from "mongoose";

//Signup
const signupUser = async (req, res) => {

    try {
        const { username, name, email, password } = req.body;
        console.log(username)//,name ,email,password)
        const user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ error: "user already exist" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword,
        });
        await newUser.save();

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }


    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log("Error in singup user", error.message);
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if (!user || !isPasswordCorrect)
            return res.status(400).json({ error: "Invalid username or password" });
        if (user.isFrozen) {
            user.isFrozen = false;
            await user.save();
        }
        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in login user", error.message);

    }
}

const logoutUser = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 1 });
        res.status(200).json({ message: "User logout successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error in logout user", error.message);
    }
}
const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);

        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString())
            return res.status(400).json({ error: "you cant follow yourself" });

        const isFollowing = currentUser.following.includes(id);
        if (isFollowing) {
            //unfolw
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });

            res.status(200).json({ message: "user unfollowed successfully" })

        } else {
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            res.status(200).json({ message: "user followed successfully" })
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in followunfollow", error.message);
    }
}

const updateUser = async (req, res) => {
    let { name, email, username, password, profilePic, bio } = req.body
    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if (!user)
            return res.status(400).json({ error: "user not found" });

        if (req.params.id !== userId.toString()) {
            return res.status(400).json({ error: "you cannot update othrrt users" })
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }
        if (profilePic) {
            if (user.profilePic) {
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0])
            }
            const uploadedResponse = await cloudinary.uploader.upload(profilePic);
            profilePic = uploadedResponse.secure_url;
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        user = await user.save();

        await Post.updateMany(
            { "replies.userId": userId },
            {
                $set: {
                    "replies.$[reply].username": user.username,
                    "replies.$[reply].userProfilePic": user.userProfilePic,
                }
            },
            {
                arrayFilters: [{ "reply.userId": userId }]
            }
        )

        res.status(200).json({ message: " user updated successfully", user })

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in updateUser", error.message);
    }
}

const getUserProfile = async (req, res) => {
    const { query } = req.params;
    try {
        let user;
        if (mongoose.Types.ObjectId.isValid(query)) {
            user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
        } else {
            user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
        }
        if (!user)
            return res.status(400).json({ error: "user with this username not found" });
        res.status(200).json(user);


    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in getuserprofile", error.message);
    }
}

const getSuggestedUser = async (req, res) => {
    try {
        // exclude the current user from suggested users array and exclude users that current user is already following
        const userId = req.user._id;

        const usersFollowedByYou = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId },
                },
            },
            {
                $sample: { size: 10 },
            },
        ]);
        const filteredUsers = users.filter((user) => !usersFollowedByYou.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0, 4);

        suggestedUsers.forEach((user) => (user.password = null));

        res.status(200).json(suggestedUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

const getFollower = async (req, res) => {
    try {
        //To get list of all followers of a user
        const username = req.params.username;
        const usersFollowYou = await User.findOne({
            username: username
        });

        const users = await User.aggregate([{ $sample: { size: 100000 } }]);
        const filteredUsers = users.filter((user) => usersFollowYou.followers.includes(user._id));
        filteredUsers.forEach((user) => (user.password = null));

        res.status(200).json(filteredUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getFollowing = async (req, res) => {

    try {
        //To get list of users that user follows followers 

        const username = req.params.username;
        const usersFollowYou = await User.findOne({ username: username })
        const users = await User.aggregate([{ $sample: { size: 100000 } }]);

        const filteredUsers = users.filter((user) => usersFollowYou.following.includes(user._id));
        users.forEach((user) => (user.password = null));
        res.status(200).json(filteredUsers);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const freezeAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).json({ error: "user with this username not found" });
        }
        user.isFrozen = true;
        await user.save();
        res.status(200).json({ success: true });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export { followUnfollowUser, getSuggestedUser, getFollower, getFollowing, getUserProfile, loginUser, logoutUser, signupUser, updateUser, freezeAccount };

