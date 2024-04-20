import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
    try {
        let { postedBy, text, img } = req.body;
        if (!postedBy || !text) {
            return res.status(400).json({ error: "postby and text are reqiurd" });
        }
        const user = await User.findById(postedBy);

        if (!user)
            return res.status(404).json({ error: "User not found" });

        if (user._id.toString() !== req.user._id.toString())
            return res.status(401).json({ error: "un Authorised to create post" });

        const maxLength = 500;

        if (text.length > maxLength)
            return res.status(400).json({ error: "reduce text size to create post" });
        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }
        const newPost = new Post({ postedBy, text, img });
        await newPost.save();

        res.status(200).json(newPost);

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in create post", error.message);
    }
}

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post)
            return res.status(404).json({ error: "post not found" });

        res.status(200).json(post);

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in get post", error.message);
    }

}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post)
            return res.status(404).json({ error: "post not found" });

        if (post.postedBy.toString() !== req.user._id.toString())
            return res.status(401).json({ error: " unauthorised" });

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: " post deleted ", post });

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in delete post", error.message);
    }
}

const likeUnlikePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post)
            return res.status(404).json({ error: "post not found" });

        const userLikedPost = post.likes.includes(userId);
        if (userLikedPost) {
            //unlike
            console.log("am in like post")
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            return res.status(200).json({ message: "pos unliked succes fully" });
        } else {
            //like
            post.likes.push(userId);
            await post.save();
            return res.status(200).json({ message: "post liked succes fully" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in delete post", error.message);
    }

}
const replyToPost = async (req, res) => {
    try {
        const { text } = req.body;
        const { id: postId } = req.params;
        const userId = req.user._id;
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;

        if (!text)
            return res.status(404).json({ error: "Text is required" });

        const post = await Post.findById(postId);
        if (!post)
            return res.status(404).json({ error: "post not found" });

        const reply = { userId, text, userProfilePic, username };
        post.replies.push(reply);
        await post.save();

        res.status(200).json(reply);

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in reply post", error.message);
    }

}

const getFeed = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        const following = user.following;
        const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });
        res.status(200).json(feedPosts);

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in feed", error.message);
    }
}

const getUserPosts = async (req, res) => {

    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });
        res.status(200).json(posts);

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in getUserPost", error.message);
    }

}

export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeed, getUserPosts };