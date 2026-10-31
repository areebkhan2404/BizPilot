import SchemeCache from "../models/schemeCacheModel.js"

// In-memory rate limit: 10 AI calls per user per minute
const rateLimitMap = new Map()

const checkRateLimit = (userId) => {
    const key = userId.toString()
    const now = Date.now()
    if (!rateLimitMap.has(key)) {
        rateLimitMap.set(key, { count: 1, windowStart: now })
        return
    }
    const entry = rateLimitMap.get(key)
    if (now - entry.windowStart > 60000) {
        rateLimitMap.set(key, { count: 1, windowStart: now })
        return
    }
    if (entry.count >= 10) {
        throw new Error("Rate limit exceeded: max 10 AI requests per minute. Please wait.")
    }
    entry.count += 1
}

const getClient = () => {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
        throw new Error("GEMINI_API_KEY is not set")
    }
    const { GoogleGenAI } = require("@google/genai")
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
}

const getClientESM = async () => {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
        throw new Error("GEMINI_API_KEY is not set")
    }
    const { GoogleGenAI } = await import("@google/genai")
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
}

const MODEL = () => process.env.GEMINI_MODEL || "gemini-3.8-flash"

const generateIdeas = async ({ city, state, budget, interests, experience, userId }) => {
    checkRateLimit(userId)
    const ai = await getClientESM()

    const interestList = Array.isArray(interests) ? interests.join(", ") : interests

    const prompt = `You are an expert Indian business consultant. Generate 5 to 7 business ideas for a person in ${city}, ${state} with a budget of Rs ${budget} who is interested in: ${interestList}. Their experience level is: ${experience}.

Important guidelines:
- All costs must be in Indian Rupees (INR)
- Be specific to the city ${city} and its local market
- Be conservative with revenue estimates
- Never promise profit
- Include confidence level based on how well the idea fits the city and budget
- Set fitsBudget based on whether investment <= ${budget}

Return a JSON array of business ideas. Each idea must have exactly these fields:
- title: string (business name)
- category: string (e.g. "Food & Beverage", "Retail", "Services")
- investment: number (total estimated investment in INR, no commas)
- monthlyRevenueMin: number (minimum expected monthly revenue in INR)
- monthlyRevenueMax: number (maximum expected monthly revenue in INR)
- competition: string (exactly "low", "medium", or "high")
- risk: string (exactly "low", "medium", or "high")
- reason: string (2-3 sentences explaining why this suits ${city})
- confidence: string (exactly "low", "medium", or "high")

Return ONLY a valid JSON array, no markdown, no explanation.`

    const response = await ai.models.generateContent({
        model: MODEL(),
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json"
        }
    })

    let ideas
    try {
        const text = response.text
        ideas = JSON.parse(text)
    } catch (e) {
        throw new Error("AI service failed, please try again!")
    }

    if (!Array.isArray(ideas)) {
        throw new Error("AI service failed, please try again!")
    }

    // Server-side: set fitsBudget based on investment vs budget
    ideas = ideas.map((idea) => ({
        ...idea,
        fitsBudget: Number(idea.investment) <= Number(budget)
    }))

    // Sort: fitting ideas first
    ideas.sort((a, b) => {
        if (a.fitsBudget && !b.fitsBudget) return -1
        if (!a.fitsBudget && b.fitsBudget) return 1
        return 0
    })

    return ideas
}

const generateGrowthPlan = async ({ idea, city, budget, userId }) => {
    checkRateLimit(userId)
    const ai = await getClientESM()

    const prompt = `You are an expert Indian business growth advisor. Create a detailed growth plan for a "${idea.title}" business in ${city} with an investment of Rs ${idea.investment}.

Generate a JSON object with a "phases" array containing exactly 4 phases:
1. "First 30 Days" - immediate setup and launch tasks
2. "Next 3 Months" - early growth and stability
3. "6 Months" - scaling and optimization
4. "1 Year" - expansion and long-term strategy

Each phase must have:
- title: string (the phase name)
- goals: array of strings (3-5 high-level goals for this phase)
- tasks: array of objects, each with:
  - text: string (specific actionable task)
  
Include tasks covering: marketing, pricing, staffing, online presence, customer retention, and expansion planning. Each phase should have 6-10 tasks.

Return ONLY a valid JSON object like: { "phases": [...] }. No markdown, no explanation.`

    const response = await ai.models.generateContent({
        model: MODEL(),
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json"
        }
    })

    let result
    try {
        result = JSON.parse(response.text)
    } catch (e) {
        throw new Error("AI service failed, please try again!")
    }

    if (!result || !Array.isArray(result.phases)) {
        throw new Error("AI service failed, please try again!")
    }

    // Add isDone: false to each task
    result.phases = result.phases.map((phase) => ({
        ...phase,
        tasks: phase.tasks.map((task) => ({ ...task, isDone: false }))
    }))

    return result
}

const searchSchemes = async ({ businessType, state, city, launchDate, userId }) => {
    checkRateLimit(userId)

    // Check cache first
    const cacheKey = `${businessType}|${state}|${city}|${new Date(launchDate).toISOString().slice(0, 7)}`
    const cached = await SchemeCache.findOne({ queryKey: cacheKey })
    if (cached) {
        return {
            schemes: cached.results,
            lastChecked: cached.fetchedAt,
            fromCache: true
        }
    }

    const ai = await getClientESM()

    const prompt = `Search for active Indian government schemes and subsidies for a ${businessType} business in ${state} (city: ${city}) planning to launch around ${launchDate}.

Find real, currently active schemes from official Indian government sources. Include central government schemes (like PMEGP, Mudra, Startup India, etc.) and state-specific schemes for ${state}.

Return ONLY a valid JSON array. Each element must have exactly these fields:
- name: string (official scheme name)
- benefit: string (what the scheme provides - loan amount, subsidy %, etc.)
- eligibility: string (who can apply)
- applyUrl: string (direct URL to apply - must start with http)
- sourceUrl: string (official government source URL - must start with http)
- status: string ("active" or "expired")

Rules:
- ONLY include schemes with real, verifiable sourceUrl starting with http
- NEVER invent schemes or URLs
- ONLY include currently active schemes
- Include 3-8 real schemes

Return ONLY valid JSON array, no markdown fences.`

    const response = await ai.models.generateContent({
        model: MODEL(),
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
            tools: [{ googleSearch: {} }]
        }
    })

    let schemes = []
    try {
        let text = response.text.trim()
        // Strip markdown fences if present
        text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "")
        const parsed = JSON.parse(text)
        if (Array.isArray(parsed)) {
            schemes = parsed
        }
    } catch (e) {
        schemes = []
    }

    // Filter: only schemes with valid sourceUrl
    schemes = schemes.filter(
        (s) => s.sourceUrl && typeof s.sourceUrl === "string" && s.sourceUrl.startsWith("http")
    )

    // Cache for 24 hours
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    await SchemeCache.create({
        queryKey: cacheKey,
        results: schemes,
        fetchedAt: now,
        expiresAt
    })

    return {
        schemes,
        lastChecked: now,
        fromCache: false
    }
}

const chatWithAi = async ({ history, message, userId }) => {
    checkRateLimit(userId)
    const ai = await getClientESM()

    const systemInstruction = `You are a practical business advisor for small Indian businesses. 
You help entrepreneurs in India with business planning, operations, marketing, and growth strategies.
Rules:
- Give practical, actionable advice specific to India
- Never guarantee profits or success
- For legal, tax, or regulatory matters, always suggest consulting a CA, lawyer, or local mentor
- Keep answers concise and clear
- You can respond in Hindi, Hinglish, or English based on what the user writes
- Never make claims about "100% accuracy" or "guaranteed returns"`

    const contents = []

    // Add history
    if (Array.isArray(history) && history.length > 0) {
        for (const msg of history) {
            contents.push({
                role: msg.isAI ? "model" : "user",
                parts: [{ text: msg.message }]
            })
        }
    }

    // Add current message
    contents.push({
        role: "user",
        parts: [{ text: message }]
    })

    const response = await ai.models.generateContent({
        model: MODEL(),
        contents,
        config: {
            systemInstruction
        }
    })

    return response.text
}

const geminiService = { generateIdeas, generateGrowthPlan, searchSchemes, chatWithAi }

export default geminiService
