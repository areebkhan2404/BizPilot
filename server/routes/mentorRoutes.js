import express from "express"
import mentorController from "../controllers/mentor/mentorController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", mentorController.getMentors)
router.post("/request", protect.forUser, mentorController.applyAsMentor)

export default router
