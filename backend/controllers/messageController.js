import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

async function sendMessage(req, res) {
    try {
        const { recipientId, message } = req.body;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] },
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, recipientId],
                lastMessage: {
                    text: message,
                    sender: senderId,
                }
            })
            await conversation.save();
        }
        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            text: message
        });

        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                lastMessage: {
                    text: message,
                    sender: senderId,
                }
            })
        ])
        res.status(201).json(newMessage);


    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

async function getMessages(req, res) {

    const { otherUserId } = req.params;
    const userId = req.user._id;

    try {
        let conversation = await Conversation.findOne({
            participants: { $all: [userId, otherUserId] },
        });

        if (!conversation) {
            return res.status(404).json({ error: "conversation not found" });
        }

        const messages = await Message.find({
            conversationId: conversation._id
        }).sort({ createdAt: 1 })

        res.status(200).json(messages);

    } catch (error) {
        res.status(500).json({ error: error.message })

    }

}

async function getConversations(req, res) {

    const userId = req.user._id;

    try {
        const conversations = await Conversation.find({ participants: userId }).populate({
            path: "participants",
            select: "username profilePic",
        });

        if (!conversations) {
            return res.status(404).json({ error: "conversation not found" });
        }

        conversations.forEach(conversation => {
            conversation.participants = conversation.participants.filter(
                participants => participants._id.toString() !== userId.toString()
            )
        })

        res.status(200).json(conversations);

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}

export { sendMessage, getMessages, getConversations };