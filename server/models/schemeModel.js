import mongoose from "mongoose"

const schemeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Scheme name is required!"]
        },
        benefit: String,
        eligibility: String,
        applyUrl: String,
        sourceUrl: String,
        state: {
            type: String,
            default: "All India"
        },
        category: String,
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
)

const Scheme = mongoose.model("Scheme", schemeSchema)

export default Scheme
