import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

const forUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401)
            throw new Error("Not authorized, no token")
        }
        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select("-password")
        if (!user) {
            res.status(401)
            throw new Error("Not authorized, user not found")
        }
        if (user.isActive === false) {
            res.status(401)
            throw new Error("Account is deactivated")
        }
        req.user = user
        next()
    } catch (error) {
        res.status(401)
        throw new Error(error.message)
    }
}

const forAdmin = async (req, res, next) => {
    await forUser(req, res, async () => {
        if (req.user && req.user.userType === "ADMIN") {
            next()
        } else {
            res.status(403)
            throw new Error("Not authorized as admin")
        }
    })
}

const forMentor = async (req, res, next) => {
    await forUser(req, res, async () => {
        if (req.user && (req.user.userType === "MENTOR" || req.user.userType === "ADMIN")) {
            next()
        } else {
            res.status(403)
            throw new Error("Not authorized as mentor")
        }
    })
}

const protect = { forUser, forAdmin, forMentor }

export default protect
