import mongoose from "mongoose"

const chatMessageSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        sessionId: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        isAI: {
            type: Boolean,
            required: true
        }
    },
    { timestamps: true }
)

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema)

export default ChatMessage
