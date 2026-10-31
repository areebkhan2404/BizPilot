import Mentor from "../../models/mentorModel.js"

const getMentors = async (req, res) => {
    const mentors = await Mentor.find({ isVerified: true, isActive: true })
        .populate("user", "-password")
        .sort({ createdAt: -1 })
    res.json(mentors)
}

const applyAsMentor = async (req, res) => {
    const {
        businessName,
        address,
        qualification,
        registrationNumber,
        experience,
        expertise,
        phone,
        email,
        consultationFee,
        workingHours,
        availableDays
    } = req.body

    if (!businessName || !qualification || !experience) {
        res.status(409)
        throw new Error("Please Fill All Required Details!")
    }

    const existing = await Mentor.findOne({ user: req.user._id })
    if (existing) {
        res.status(409)
        throw new Error("You have already submitted a mentor application!")
    }

    const mentor = await Mentor.create({
        user: req.user._id,
        businessName,
        address,
        qualification,
        registrationNumber,
        experience,
        expertise: Array.isArray(expertise) ? expertise : [],
        phone: phone || req.user.phone,
        email: email || req.user.email,
        consultationFee,
        workingHours,
        availableDays: Array.isArray(availableDays) ? availableDays : []
    })

    res.status(201).json({ message: "Mentor application submitted successfully!", mentor })
}

const mentorController = { getMentors, applyAsMentor }

export default mentorController
