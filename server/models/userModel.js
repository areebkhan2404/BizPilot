import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter Name!"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Please Enter Email!"],
            unique: true,
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            required: [true, "Please Enter Phone!"],
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, "Please Enter Password!"]
        },
        age: {
            type: Number
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"]
        },
        address: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        userType: {
            type: String,
            enum: ["USER", "MENTOR", "ADMIN"],
            default: "USER"
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
)

const User = mongoose.model("User", userSchema)

export default User
