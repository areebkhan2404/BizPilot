import mongoose from "mongoose"

const ideaSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        request: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "IdeaRequest"
        },
        title: {
            type: String,
            required: [true, "Title is required!"]
        },
        category: String,
        investment: Number,
        monthlyRevenueMin: Number,
        monthlyRevenueMax: Number,
        competition: {
            type: String,
            enum: ["low", "medium", "high"]
        },
        risk: {
            type: String,
            enum: ["low", "medium", "high"]
        },
        reason: String,
        confidence: {
            type: String,
            enum: ["low", "medium", "high"]
        },
        fitsBudget: {
            type: Boolean,
            default: true
        },
        isSaved: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)

const Idea = mongoose.model("Idea", ideaSchema)

export default Idea
