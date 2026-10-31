import mongoose from "mongoose"

const taskSchema = new mongoose.Schema({
    text: String,
    isDone: {
        type: Boolean,
        default: false
    }
})

const phaseSchema = new mongoose.Schema({
    title: String,
    goals: [String],
    tasks: [taskSchema]
})

const growthPlanSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        idea: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Idea"
        },
        phases: [phaseSchema],
        status: {
            type: String,
            enum: ["active", "completed"],
            default: "active"
        }
    },
    { timestamps: true }
)

const GrowthPlan = mongoose.model("GrowthPlan", growthPlanSchema)

export default GrowthPlan
