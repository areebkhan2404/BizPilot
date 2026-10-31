import geminiService from "../../services/geminiService.js"
import Scheme from "../../models/schemeModel.js"

const searchSchemes = async (req, res) => {
    const { businessType, state, city, launchDate } = req.body
    if (!businessType || !state || !launchDate) {
        res.status(409)
        throw new Error("Please provide businessType, state, and launchDate!")
    }

    const result = await geminiService.searchSchemes({
        businessType,
        state,
        city: city || state,
        launchDate,
        userId: req.user._id
    })

    res.json(result)
}

const getCuratedSchemes = async (req, res) => {
    const schemes = await Scheme.find({ isActive: true }).sort({ createdAt: -1 })
    res.json(schemes)
}

const schemeController = { searchSchemes, getCuratedSchemes }

export default schemeController
