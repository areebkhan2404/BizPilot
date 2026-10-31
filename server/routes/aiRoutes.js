import express from "express"
import aiController from "../controllers/ai/aiController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/ideas", protect.forUser, aiController.generateIdeas)
router.get("/ideas", protect.forUser, aiController.getIdeas)
router.put("/ideas/:iid", protect.forUser, aiController.toggleSaveIdea)

router.post("/chat", protect.forUser, aiController.sendChatMessage)
router.get("/chat/:sessionId", protect.forUser, aiController.getChatHistory)

export default router
