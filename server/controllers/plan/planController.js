import geminiService from "../../services/geminiService.js"
import Idea from "../../models/ideaModel.js"
import GrowthPlan from "../../models/growthPlanModel.js"

const generatePlan = async (req, res) => {
    const idea = await Idea.findOne({ _id: req.params.iid, user: req.user._id })
    if (!idea) {
        res.status(404)
        throw new Error("Idea Not Found!")
    }

    // Check if plan already exists for this idea
    const existing = await GrowthPlan.findOne({ idea: idea._id, user: req.user._id })
    if (existing) {
        res.json(existing)
        return
    }

    const planData = await geminiService.generateGrowthPlan({
        idea,
        city: req.body.city || "India",
        budget: idea.investment,
        userId: req.user._id
    })

    const plan = await GrowthPlan.create({
        user: req.user._id,
        idea: idea._id,
        phases: planData.phases,
        status: "active"
    })

    res.status(201).json(plan)
}

const getPlans = async (req, res) => {
    const plans = await GrowthPlan.find({ user: req.user._id })
        .populate("idea")
        .sort({ createdAt: -1 })
    res.json(plans)
}

const getPlan = async (req, res) => {
    const plan = await GrowthPlan.findOne({
        _id: req.params.plid,
        user: req.user._id
    }).populate("idea")
    if (!plan) {
        res.status(404)
        throw new Error("Plan Not Found!")
    }
    res.json(plan)
}

const updateTask = async (req, res) => {
    const { phaseIndex, taskIndex, isDone } = req.body
    if (phaseIndex === undefined || taskIndex === undefined || isDone === undefined) {
        res.status(409)
        throw new Error("Please provide phaseIndex, taskIndex, and isDone!")
    }

    const plan = await GrowthPlan.findOne({ _id: req.params.plid, user: req.user._id })
    if (!plan) {
        res.status(404)
        throw new Error("Plan Not Found!")
    }

    if (!plan.phases[phaseIndex] || !plan.phases[phaseIndex].tasks[taskIndex]) {
        res.status(404)
        throw new Error("Task Not Found!")
    }

    plan.phases[phaseIndex].tasks[taskIndex].isDone = isDone

    // Check if all tasks are done across all phases
    const allDone = plan.phases.every((phase) => phase.tasks.every((task) => task.isDone))
    if (allDone) plan.status = "completed"
    else plan.status = "active"

    await plan.save()
    res.json(plan)
}

const planController = { generatePlan, getPlans, getPlan, updateTask }

export default planController
