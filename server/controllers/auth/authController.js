import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../../models/userModel.js"

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" })
}

const register = async (req, res) => {
    const { name, email, phone, city, state, password } = req.body
    if (!name || !email || !phone || !password) {
        res.status(409)
        throw new Error("Please Fill All Details!")
    }
    if (password.length < 8) {
        res.status(409)
        throw new Error("Password must be at least 8 characters!")
    }
    const userExists = await User.findOne({ $or: [{ email }, { phone }] })
    if (userExists) {
        res.status(409)
        throw new Error("User with this email or phone already exists!")
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    await User.create({
        name,
        email,
        phone,
        city,
        state,
        password: hashedPassword
    })
    res.status(201).json({ message: "Registered Successfully!" })
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(409)
        throw new Error("Please Fill All Details!")
    }
    const user = await User.findOne({ email })
    if (!user) {
        res.status(401)
        throw new Error("Invalid email or password!")
    }
    if (user.isActive === false) {
        res.status(401)
        throw new Error("Account is deactivated. Contact admin.")
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        res.status(401)
        throw new Error("Invalid email or password!")
    }
    const token = generateToken(user._id)
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        city: user.city,
        state: user.state,
        address: user.address,
        token
    })
}

const getMe = async (req, res) => {
    const user = await User.findById(req.user._id).select("-password")
    if (!user) {
        res.status(404)
        throw new Error("User Not Found!")
    }
    res.json(user)
}

const updateMe = async (req, res) => {
    const { name, phone, age, gender, address, city, state, password } = req.body
    const user = await User.findById(req.user._id)
    if (!user) {
        res.status(404)
        throw new Error("User Not Found!")
    }
    const updateData = { name, phone, age, gender, address, city, state }
    if (password) {
        if (password.length < 8) {
            res.status(409)
            throw new Error("Password must be at least 8 characters!")
        }
        const salt = await bcrypt.genSalt(10)
        updateData.password = await bcrypt.hash(password, salt)
    }
    const updated = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).select("-password")
    res.json(updated)
}

const authController = { register, login, getMe, updateMe }

export default authController
