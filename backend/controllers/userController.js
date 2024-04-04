import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAdSetCookie.js";
import { json } from "express";

//Signup
const signupUser = async (req, res) => {

    try {
        const { username, name, email, password } = req.body;
        console.log(username)//,name ,email,password)
        const user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ message: "user alredy exist" });
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
        res.status(500).json({ message: error.message })
        console.log("Error in singupuser", error.message);

    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if (!user || !isPasswordCorrect)
            return res.status(400).json({ message: "Invalid username or password" });

        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
        });



    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error in loginuser", error.message);

    }
}

const logoutUser = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 1 });
        res.status(200).json({ message: "User logoyut seccesfully" });


    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error in logoutuser", error.message);


    }
}
const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString())
            return res.status(400).json({ message: "you cant follow same user yourself youare" });

        const isFollowing = currentUser.following.includes(id);
        if (isFollowing) {
            //unfolw
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });

            res.status(200).json({ message: "user unfollowed suceesfully" })

        } else {
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            res.status(200).json({ message: "user followed suceesfully" })
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error in followumfolow", error.message);
    }
}

const updateUser = async (req, res) => {
    const { name, email, username, password, profilePic, bio } = req.body
    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if (!user)
            return res.status(400).json({ message: "user not found" });

        if (req.params.id !== userId.toString()) {
            return res.status(400).json({ message: "you cannot update othrrt users" })
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        user = await user.save();
        res.status(200).json({ message: " user updated seceesfully", user })

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error in updateUser", error.message);
    }
}

const getUserProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username }).select("-password").select("-updatedAt");
        if (!user)
            return res.status(400).json({ message: "user with this username not fuunt" });
        res.status(200).json(user);


    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error in getuserprofile", error.message);
    }
}


export { signupUser, loginUser, logoutUser, followUnfollowUser, updateUser, getUserProfile };