import User from "../../models/userModel.js"
import Mentor from "../../models/mentorModel.js"
import Idea from "../../models/ideaModel.js"
import Scheme from "../../models/schemeModel.js"

const getAllUsers = async (req, res) => {
    const users = await User.find({ userType: { $ne: "ADMIN" } })
        .select("-password")
        .sort({ createdAt: -1 })
    res.json(users)
}

const getAllMentors = async (req, res) => {
    const mentors = await Mentor.find()
        .populate("user", "-password")
        .sort({ createdAt: -1 })
    res.json(mentors)
}

const getAllIdeas = async (req, res) => {
    const ideas = await Idea.find()
        .populate("user", "-password")
        .sort({ createdAt: -1 })
    res.json(ideas)
}

const getAllSchemes = async (req, res) => {
    const schemes = await Scheme.find().sort({ createdAt: -1 })
    res.json(schemes)
}

const createScheme = async (req, res) => {
    const { name, benefit, eligibility, applyUrl, sourceUrl, state, category } = req.body
    if (!name || !benefit) {
        res.status(409)
        throw new Error("Please Fill All Required Details!")
    }
    const scheme = await Scheme.create({
        name,
        benefit,
        eligibility,
        applyUrl,
        sourceUrl,
        state: state || "All India",
        category,
        isActive: true
    })
    res.status(201).json(scheme)
}

const updateScheme = async (req, res) => {
    const scheme = await Scheme.findById(req.params.sid)
    if (!scheme) {
        res.status(404)
        throw new Error("Scheme Not Found!")
    }
    const updated = await Scheme.findByIdAndUpdate(req.params.sid, req.body, { new: true })
    res.json(updated)
}

const updateMentor = async (req, res) => {
    const mentor = await Mentor.findById(req.params.mid)
    if (!mentor) {
        res.status(404)
        throw new Error("Mentor Not Found!")
    }
    const { isVerified, isActive } = req.body
    const updated = await Mentor.findByIdAndUpdate(
        req.params.mid,
        { isVerified, isActive },
        { new: true }
    ).populate("user", "-password")

    // Update user type based on verification status
    if (typeof isVerified === "boolean") {
        await User.findByIdAndUpdate(mentor.user, {
            userType: isVerified ? "MENTOR" : "USER"
        })
    }

    res.json(updated)
}

const updateUser = async (req, res) => {
    const user = await User.findById(req.params.uid)
    if (!user) {
        res.status(404)
        throw new Error("User Not Found!")
    }
    const { isActive, userType } = req.body
    const updated = await User.findByIdAndUpdate(
        req.params.uid,
        { isActive, userType },
        { new: true }
    ).select("-password")
    res.json(updated)
}

const adminController = {
    getAllUsers,
    getAllMentors,
    getAllIdeas,
    getAllSchemes,
    createScheme,
    updateScheme,
    updateMentor,
    updateUser
}

export default adminController
