import express from "express"
import planController from "../controllers/plan/planController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/:iid", protect.forUser, planController.generatePlan)
router.get("/", protect.forUser, planController.getPlans)
router.get("/:plid", protect.forUser, planController.getPlan)
router.put("/:plid/tasks", protect.forUser, planController.updateTask)

export default router
