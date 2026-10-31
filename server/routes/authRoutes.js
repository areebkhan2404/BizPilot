import express from "express"
import authController from "../controllers/auth/authController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/register", authController.register)
router.post("/login", authController.login)
router.get("/me", protect.forUser, authController.getMe)
router.put("/me", protect.forUser, authController.updateMe)

export default router
