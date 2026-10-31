import express from "express"
import schemeController from "../controllers/scheme/schemeController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/search", protect.forUser, schemeController.searchSchemes)
router.get("/", schemeController.getCuratedSchemes)

export default router
