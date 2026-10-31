import mongoose from "mongoose"

const ideaRequestSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        city: {
            type: String,
            required: [true, "Please Enter City!"]
        },
        state: {
            type: String,
            required: [true, "Please Enter State!"]
        },
        budget: {
            type: Number,
            required: [true, "Please Enter Budget!"]
        },
        interests: [String],
        experience: {
            type: String,
            enum: ["beginner", "intermediate", "experienced"],
            required: [true, "Please Select Experience Level!"]
        }
    },
    { timestamps: true }
)

const IdeaRequest = mongoose.model("IdeaRequest", ideaRequestSchema)

export default IdeaRequest
