import { Link } from "react-router-dom"
import { Lightbulb, TrendingUp, FileText, MessageSquare, ArrowRight, CheckCircle, Star } from "lucide-react"
import Button from "../components/common/Button.jsx"
import Card from "../components/common/Card.jsx"
import Badge from "../components/common/Badge.jsx"

const features = [
  {
    icon: Lightbulb,
    title: "AI Idea Generator",
    description: "Get 5-7 business ideas tailored to your city, budget, and interests. Each idea includes investment, revenue estimates, and risk analysis.",
    badge: "Popular",
    badgeVariant: "success",
    color: "emerald",
    link: "/auth/ideas"
  },
  {
    icon: TrendingUp,
    title: "Growth Planner",
    description: "AI creates a personalized 30-day, 3-month, 6-month, and 1-year action plan for your chosen business idea with checkable tasks.",
    badge: "AI-Powered",
    badgeVariant: "purple",
    color: "violet",
    link: "/auth/planner"
  },
  {
    icon: FileText,
    title: "Scheme Finder",
    description: "Discover active government schemes like PMEGP, Mudra Yojana, and Startup India that apply to your business type and state.",
    badge: "Live Search",
    badgeVariant: "info",
    color: "blue",
    link: "/auth/scheme-finder"
  },
  {
    icon: MessageSquare,
    title: "Business AI Chat",
    description: "Ask anything about starting your business. Get practical answers in Hindi, Hinglish, or English from your AI business advisor.",
    badge: "Hindi Support",
    badgeVariant: "warning",
    color: "amber",
    link: "/auth/chat"
  }
]

const steps = [
  { step: "01", title: "Enter your details", desc: "Share your city, budget, interests, and experience level." },
  { step: "02", title: "Get AI suggestions", desc: "Receive 5-7 tailored business ideas with detailed analysis." },
  { step: "03", title: "Choose and plan", desc: "Pick your idea and get a full growth plan with actionable steps." },
  { step: "04", title: "Find funding", desc: "Discover government schemes to fund your business." }
]

const LandingPage = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <Badge variant="success" className="mb-6">AI-Powered for Indian Entrepreneurs</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Start the right business<br />
            <span className="text-emerald-400">in your city</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            BizPilot uses AI to suggest business ideas tailored to your city, budget, and interests — 
            then builds you a complete growth plan and finds government funding.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="primary" icon={ArrowRight}>
                Start Planning Free
              </Button>
            </Link>
            <Link to="/schemes">
              <Button size="lg" variant="outline" className="text-white bg-white/10 border-white/30 hover:bg-white/20 hover:text-white">
                View Govt. Schemes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Everything you need to launch</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Four powerful AI tools working together to help you start and grow your business in India.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Link key={feature.title} to={feature.link}>
                  <Card hoverEffect className="p-6 h-full">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <Icon size={22} className="text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-slate-800">{feature.title}</h3>
                          <Badge variant={feature.badgeVariant} size="sm">{feature.badge}</Badge>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                      </div>
                      <ArrowRight size={16} className="text-slate-300 flex-shrink-0 mt-1" />
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">How BizPilot works</h2>
            <p className="text-slate-500">From idea to action plan in minutes</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.step} className="text-center">
                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Card */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">See it in action</h2>
            <p className="text-slate-500">Example: Cloud Kitchen in Indore with Rs 5 lakh budget</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Cloud Kitchen</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Food & Beverage · Indore, MP</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="success" dot>Fits Budget</Badge>
                  <Badge variant="info">Medium Risk</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-0.5">Investment</p>
                  <p className="font-semibold text-slate-800">₹3.5 – 4.5 Lakh</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-0.5">Monthly Revenue</p>
                  <p className="font-semibold text-emerald-700">₹60K – ₹1.2 Lakh</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Indore's thriving food culture and growing IT workforce create strong demand for online food delivery. 
                Cloud kitchens have lower overhead than dine-in restaurants and can be started from a rented commercial kitchen.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Zomato/Swiggy listing", "Local delivery radius", "Low competition area"].map((point) => (
                  <div key={point} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <CheckCircle size={13} className="text-emerald-500" />
                    {point}
                  </div>
                ))}
              </div>
              <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                ⚠️ These are AI-generated estimates. Verify investment and revenue figures locally before investing.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start your business journey?</h2>
          <p className="text-emerald-100 mb-8 text-lg">
            Join thousands of Indian entrepreneurs using AI to plan smarter.
          </p>
          <Link to="/register">
            <Button size="lg" className=" bg-slate-800 text-emerald-700 hover:bg-emerald-50 border-0">
              Get Started Free <ArrowRight size={16} className="ml-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default LandingPage

