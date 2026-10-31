import express from "express"
import adminController from "../controllers/admin/adminController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/users", protect.forAdmin, adminController.getAllUsers)
router.get("/mentors", protect.forAdmin, adminController.getAllMentors)
router.get("/ideas", protect.forAdmin, adminController.getAllIdeas)
router.get("/schemes", protect.forAdmin, adminController.getAllSchemes)

router.post("/scheme", protect.forAdmin, adminController.createScheme)
router.put("/scheme/:sid", protect.forAdmin, adminController.updateScheme)
router.put("/mentor/:mid", protect.forAdmin, adminController.updateMentor)
router.put("/user/:uid", protect.forAdmin, adminController.updateUser)

export default router
