import { useState } from "react"
import { useSelector } from "react-redux"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import aiService from "../../services/aiService.js"
import planService from "../../services/planService.js"
import Card from "../../components/common/Card.jsx"
import Badge from "../../components/common/Badge.jsx"
import Button from "../../components/common/Button.jsx"
import Input from "../../components/common/Input.jsx"
import Loader from "../../components/common/Loader.jsx"
import {
  MapPin, DollarSign, Lightbulb, Sparkles, Bookmark, TrendingUp,
  AlertTriangle, X, Plus
} from "lucide-react"

const EXPERIENCE_OPTIONS = [
  { value: "beginner", label: "Beginner — No prior experience" },
  { value: "intermediate", label: "Intermediate — Some experience" },
  { value: "experienced", label: "Experienced — Multiple years" }
]

const INTEREST_SUGGESTIONS = [
  "Food & Beverage", "Retail", "Technology", "Education", "Healthcare",
  "Agriculture", "Fashion", "Beauty & Wellness", "Home Services", "Transport"
]

const riskVariant = { low: "success", medium: "warning", high: "danger" }
const competitionVariant = { low: "success", medium: "warning", high: "danger" }
const confidenceVariant = { high: "success", medium: "warning", low: "danger" }

const IdeaGeneratorPage = () => {
  const { user } = useSelector((state) => state.auth)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    city: user?.city || "",
    state: user?.state || "",
    budget: "",
    experience: "beginner"
  })
  const [interests, setInterests] = useState([])
  const [customInterest, setCustomInterest] = useState("")
  const [results, setResults] = useState(null)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const addInterest = (interest) => {
    if (!interests.includes(interest)) {
      setInterests((prev) => [...prev, interest])
    }
  }

  const removeInterest = (interest) => {
    setInterests((prev) => prev.filter((i) => i !== interest))
  }

  const addCustomInterest = () => {
    if (customInterest.trim() && !interests.includes(customInterest.trim())) {
      setInterests((prev) => [...prev, customInterest.trim()])
      setCustomInterest("")
    }
  }

  const { mutate: generateIdeas, isPending } = useMutation({
    mutationFn: (data) => aiService.generateIdeas(data, user?.token),
    onSuccess: (data) => {
      setResults(data)
      queryClient.invalidateQueries({ queryKey: ["my-ideas"] })
      toast.success(`Generated ${data.ideas?.length || 0} business ideas!`)
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong!")
    }
  })

  const { mutate: saveIdea, isPending: isSaving } = useMutation({
    mutationFn: (iid) => aiService.toggleSaveIdea(iid, user?.token),
    onSuccess: (data) => {
      toast.success(data.isSaved ? "Idea saved!" : "Idea unsaved!")
      queryClient.invalidateQueries({ queryKey: ["my-ideas"] })
      setResults((prev) => ({
        ...prev,
        ideas: prev.ideas.map((idea) => (idea._id === data._id ? data : idea))
      }))
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong!")
    }
  })

  const { mutate: createPlan, isPending: isCreatingPlan } = useMutation({
    mutationFn: (iid) => planService.generatePlan(iid, { city: formData.city }, user?.token),
    onSuccess: (data) => {
      toast.success("Growth plan created!")
      queryClient.invalidateQueries({ queryKey: ["my-plans"] })
      navigate(`/auth/planner/${data._id}`)
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong!")
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.city || !formData.state || !formData.budget) {
      toast.error("Please fill city, state, and budget!")
      return
    }
    if (Number(formData.budget) <= 0) {
      toast.error("Budget must be greater than 0!")
      return
    }
    generateIdeas({ ...formData, budget: Number(formData.budget), interests })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">AI Business Idea Generator</h1>
          <p className="text-slate-500 text-sm">Tell us about yourself and get personalized business ideas for your city</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20">
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="City"
                  name="city"
                  placeholder="e.g. Indore"
                  icon={MapPin}
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="State"
                  name="state"
                  placeholder="e.g. Madhya Pradesh"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Budget (₹)"
                  name="budget"
                  type="number"
                  placeholder="e.g. 500000"
                  icon={DollarSign}
                  value={formData.budget}
                  onChange={handleChange}
                  required
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Experience Level <span className="text-red-500">*</span></label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Interests</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {INTEREST_SUGGESTIONS.map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => interests.includes(i) ? removeInterest(i) : addInterest(i)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                          interests.includes(i)
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300"
                        }`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add custom..."
                      value={customInterest}
                      onChange={(e) => setCustomInterest(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomInterest())}
                      className="flex-1 text-sm rounded-xl border border-slate-200 px-3 py-2 focus:border-emerald-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addCustomInterest}
                      className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  {interests.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {interests.map((i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                          {i}
                          <button type="button" onClick={() => removeInterest(i)} className="hover:text-emerald-900">
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <Button type="submit" size="lg" className="w-full" variant="ai" icon={Sparkles} disabled={isPending}>
                  {isPending ? "Generating Ideas..." : "Generate Business Ideas"}
                </Button>
              </form>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-5">
            {isPending && (
              <Card className="p-10">
                <div className="text-center">
                  <div className="w-12 h-12 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={22} className="text-violet-600 animate-pulse" />
                  </div>
                  <p className="font-medium text-slate-700">Generating personalized ideas...</p>
                  <p className="text-sm text-slate-500 mt-1">Analyzing your city, budget, and interests</p>
                  <Loader />
                </div>
              </Card>
            )}

            {!isPending && !results && (
              <Card className="p-10 text-center">
                <Lightbulb size={40} className="text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Fill the form and click Generate</p>
                <p className="text-sm text-slate-400 mt-1">You'll get 5–7 business ideas tailored to your profile</p>
              </Card>
            )}

            {results?.ideas?.map((idea, idx) => (
              <Card key={idea._id} className="p-6 animate-fade-in">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                      <h3 className="text-lg font-bold text-slate-800">{idea.title}</h3>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">{idea.category}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    <Badge variant={idea.fitsBudget ? "success" : "warning"} dot>
                      {idea.fitsBudget ? "Fits Budget" : "Stretch Option"}
                    </Badge>
                    <Badge variant={confidenceVariant[idea.confidence] || "neutral"} size="sm">
                      {idea.confidence} confidence
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-[10px] text-slate-400 mb-0.5">Investment</p>
                    <p className="text-sm font-semibold text-slate-800">₹{idea.investment?.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3">
                    <p className="text-[10px] text-slate-400 mb-0.5">Monthly Revenue</p>
                    <p className="text-sm font-semibold text-emerald-700">
                      ₹{idea.monthlyRevenueMin?.toLocaleString("en-IN")} – ₹{idea.monthlyRevenueMax?.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-[10px] text-slate-400 mb-0.5">Competition</p>
                    <Badge variant={competitionVariant[idea.competition] || "neutral"} size="sm">
                      {idea.competition}
                    </Badge>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-[10px] text-slate-400 mb-0.5">Risk Level</p>
                    <Badge variant={riskVariant[idea.risk] || "neutral"} size="sm">
                      {idea.risk}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mb-4">{idea.reason}</p>

                {idea.confidence === "low" && (
                  <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-3">
                    <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
                    Approximate estimates — verify investment and revenue figures locally before proceeding.
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={idea.isSaved ? "secondary" : "outline"}
                    icon={Bookmark}
                    onClick={() => saveIdea(idea._id)}
                    disabled={isSaving}
                  >
                    {idea.isSaved ? "Saved" : "Save Idea"}
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={TrendingUp}
                    onClick={() => createPlan(idea._id)}
                    disabled={isCreatingPlan}
                  >
                    Create Growth Plan
                  </Button>
                </div>
              </Card>
            ))}

            {results && (
              <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <strong>Disclaimer:</strong> All figures are AI-generated estimates based on general market data. 
                Actual investment and revenue will vary. Please verify locally and consult a business advisor before investing.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default IdeaGeneratorPage

