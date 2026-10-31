import { Link } from "react-router-dom"
import { Lightbulb, TrendingUp, FileText, MessageSquare, ArrowRight, Sparkles } from "lucide-react"
import Card from "../../components/common/Card.jsx"
import Badge from "../../components/common/Badge.jsx"
import Button from "../../components/common/Button.jsx"

const AI_FEATURES = [
  {
    id: "ideas",
    title: "AI Idea Generator",
    desc: "Tell us your city, budget, and interests. Get 5–7 tailored business ideas with investment estimates, revenue ranges, risk levels, and a detailed explanation of why each idea suits your location.",
    icon: Lightbulb,
    badge: "Most Popular",
    badgeVariant: "success",
    color: "emerald",
    actionText: "Generate Ideas",
    link: "/auth/ideas"
  },
  {
    id: "planner",
    title: "Growth Planner",
    desc: "Once you choose a business idea, our AI builds a complete action plan: 30 days, 3 months, 6 months, and 1 year — each with goals and checkable tasks covering marketing, pricing, staffing, and expansion.",
    icon: TrendingUp,
    badge: "AI-Powered",
    badgeVariant: "purple",
    color: "violet",
    actionText: "View Plans",
    link: "/auth/planner"
  },
  {
    id: "schemes",
    title: "Scheme Finder",
    desc: "Search live government schemes for your business type and state. We use AI with Google Search grounding to find active schemes like PMEGP, Mudra, and Startup India — only showing results with real source links.",
    icon: FileText,
    badge: "Live Web Search",
    badgeVariant: "info",
    color: "blue",
    actionText: "Find Schemes",
    link: "/auth/scheme-finder"
  },
  {
    id: "chat",
    title: "Business AI Chat",
    desc: "Ask anything about running a business in India. Get practical advice on pricing, licensing, accounting, marketing, and more. Supports Hindi and Hinglish. Responses in minutes.",
    icon: MessageSquare,
    badge: "Hindi Support",
    badgeVariant: "warning",
    color: "amber",
    actionText: "Start Chat",
    link: "/auth/chat"
  }
]

const iconColorMap = {
  emerald: "bg-emerald-50 text-emerald-600",
  violet: "bg-violet-50 text-violet-600",
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600"
}

const AiHubPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            <Sparkles size={14} />
            Powered by Gemini AI
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-3">AI Business Tools</h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Four AI-powered tools to help you plan, launch, and grow your business in India.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {AI_FEATURES.map((feature) => {
            const Icon = feature.icon
            const colorClass = iconColorMap[feature.color] || iconColorMap.emerald
            return (
              <Card key={feature.id} className="p-6 flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="font-semibold text-slate-800">{feature.title}</h3>
                      <Badge variant={feature.badgeVariant} size="sm">{feature.badge}</Badge>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <Link to={feature.link}>
                    <Button variant="primary" size="sm" icon={ArrowRight}>
                      {feature.actionText}
                    </Button>
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Disclaimer */}
        <div className="mt-10 bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-700">
          <strong>Disclaimer:</strong> All AI-generated suggestions, revenue estimates, and investment figures are approximate and for informational purposes only. 
          Always verify with local market research, consult a CA or business advisor, and check official government portals before making any financial decisions.
        </div>
      </div>
    </div>
  )
}

export default AiHubPage

