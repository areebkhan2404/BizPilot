import geminiService from "../../services/geminiService.js"
import IdeaRequest from "../../models/ideaRequestModel.js"
import Idea from "../../models/ideaModel.js"
import ChatMessage from "../../models/chatMessageModel.js"

const generateIdeas = async (req, res) => {
    const { city, state, budget, interests, experience } = req.body
    if (!city || !state || !budget || !experience) {
        res.status(409)
        throw new Error("Please Fill All Details!")
    }
    if (Number(budget) <= 0) {
        res.status(409)
        throw new Error("Budget must be greater than 0!")
    }

    const aiIdeas = await geminiService.generateIdeas({
        city,
        state,
        budget: Number(budget),
        interests: interests || [],
        experience,
        userId: req.user._id
    })

    // Save the request
    const ideaRequest = await IdeaRequest.create({
        user: req.user._id,
        city,
        state,
        budget: Number(budget),
        interests: Array.isArray(interests) ? interests : [interests].filter(Boolean),
        experience
    })

    // Save ideas to DB
    const savedIdeas = await Idea.insertMany(
        aiIdeas.map((idea) => ({
            user: req.user._id,
            request: ideaRequest._id,
            ...idea
        }))
    )

    res.status(201).json({
        request: ideaRequest,
        ideas: savedIdeas
    })
}

const getIdeas = async (req, res) => {
    const ideas = await Idea.find({ user: req.user._id })
        .populate("request")
        .sort({ createdAt: -1 })
    res.json(ideas)
}

const toggleSaveIdea = async (req, res) => {
    const idea = await Idea.findOne({ _id: req.params.iid, user: req.user._id })
    if (!idea) {
        res.status(404)
        throw new Error("Idea Not Found!")
    }
    const updated = await Idea.findByIdAndUpdate(
        req.params.iid,
        { isSaved: !idea.isSaved },
        { new: true }
    )
    res.json(updated)
}

const sendChatMessage = async (req, res) => {
    const { sessionId, message } = req.body
    if (!sessionId || !message) {
        res.status(409)
        throw new Error("Please provide sessionId and message!")
    }

    // Save user message
    const userMsg = await ChatMessage.create({
        user: req.user._id,
        sessionId,
        message,
        isAI: false
    })

    // Get session history for context
    const history = await ChatMessage.find({ user: req.user._id, sessionId })
        .sort({ createdAt: 1 })
        .limit(20)

    // Call Gemini
    const aiReply = await geminiService.chatWithAi({
        history: history.slice(0, -1), // exclude the just-saved user message
        message,
        userId: req.user._id
    })

    // Save AI reply
    const aiMsg = await ChatMessage.create({
        user: req.user._id,
        sessionId,
        message: aiReply,
        isAI: true
    })

    res.status(201).json({ userMessage: userMsg, aiMessage: aiMsg })
}

const getChatHistory = async (req, res) => {
    const messages = await ChatMessage.find({
        user: req.user._id,
        sessionId: req.params.sessionId
    }).sort({ createdAt: 1 })
    res.json(messages)
}

const aiController = { generateIdeas, getIdeas, toggleSaveIdea, sendChatMessage, getChatHistory }

export default aiController
