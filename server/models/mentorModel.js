import mongoose from "mongoose"

const mentorSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required!"],
            unique: true
        },
        businessName: String,
        address: String,
        qualification: String,
        registrationNumber: {
            type: String,
            unique: true,
            sparse: true
        },
        experience: String,
        expertise: [String],
        phone: String,
        email: String,
        consultationFee: Number,
        workingHours: {
            start: String,
            end: String
        },
        availableDays: [
            {
                type: String,
                enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            }
        ],
        isVerified: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
)

const Mentor = mongoose.model("Mentor", mentorSchema)

export default Mentor
