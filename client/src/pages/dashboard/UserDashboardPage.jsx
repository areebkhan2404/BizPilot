import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { getProfile } from "../../features/auth/authSlice.js"
import authService from "../../services/authService.js"
import aiService from "../../services/aiService.js"
import planService from "../../services/planService.js"
import mentorService from "../../services/mentorService.js"
import Tabs from "../../components/common/Tabs.jsx"
import Loader from "../../components/common/Loader.jsx"
import Card from "../../components/common/Card.jsx"
import Badge from "../../components/common/Badge.jsx"
import ProfileForm from "../../components/ProfileForm.jsx"
import Button from "../../components/common/Button.jsx"
import { User, Lightbulb, TrendingUp, Users } from "lucide-react"
import { Link } from "react-router-dom"

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "ideas", label: "My Ideas", icon: Lightbulb },
  { id: "plans", label: "My Plans", icon: TrendingUp },
  { id: "mentor", label: "Mentor", icon: Users }
]

const UserDashboardPage = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState("profile")

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => authService.getMyProfile(user?.token),
    enabled: !!user?.token
  })

  const { data: ideas, isLoading: ideasLoading } = useQuery({
    queryKey: ["my-ideas"],
    queryFn: () => aiService.getIdeas(user?.token),
    enabled: !!user?.token && activeTab === "ideas"
  })

  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["my-plans"],
    queryFn: () => planService.getPlans(user?.token),
    enabled: !!user?.token && activeTab === "plans"
  })

  const { data: mentors, isLoading: mentorsLoading } = useQuery({
    queryKey: ["mentors-list"],
    queryFn: () => mentorService.getMentors(),
    enabled: activeTab === "mentor"
  })

  useEffect(() => {
    if (profile) {
      dispatch(getProfile(profile))
    }
  }, [profile, dispatch])

  useEffect(() => {
    if (profileError) toast.error(profileError?.response?.data?.message || "Something Went Wrong!")
  }, [profileError])

  const getPlanProgress = (plan) => {
    if (!plan.phases?.length) return 0
    const totalTasks = plan.phases.reduce((acc, p) => acc + (p.tasks?.length || 0), 0)
    const doneTasks = plan.phases.reduce(
      (acc, p) => acc + (p.tasks?.filter((t) => t.isDone)?.length || 0),
      0
    )
    return totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage your business journey from here</p>
        </div>

        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} className="mb-8" />

        {activeTab === "profile" && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-6">Profile Information</h2>
            {profileLoading ? <Loader /> : <ProfileForm />}
          </Card>
        )}

        {activeTab === "ideas" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">My Business Ideas</h2>
              <Link to="/auth/ideas">
                <Button size="sm" icon={Lightbulb}>Generate Ideas</Button>
              </Link>
            </div>
            {ideasLoading ? <Loader /> : !ideas?.length ? (
              <Card className="p-12 text-center">
                <Lightbulb size={36} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No ideas yet</p>
                <p className="text-slate-400 text-sm mt-1 mb-4">Use the AI Idea Generator to get business ideas tailored to you.</p>
                <Link to="/auth/ideas"><Button size="sm">Generate Ideas</Button></Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ideas.map((idea) => (
                  <Card key={idea._id} className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-slate-800">{idea.title}</h3>
                      <div className="flex gap-1.5">
                        {idea.isSaved && <Badge variant="success" size="sm" dot>Saved</Badge>}
                        <Badge variant={idea.fitsBudget ? "success" : "warning"} size="sm">
                          {idea.fitsBudget ? "Fits Budget" : "Stretch"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">{idea.reason}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-50 rounded-lg p-2">
                        <p className="text-[10px] text-slate-400">Investment</p>
                        <p className="text-sm font-semibold text-slate-700">₹{idea.investment?.toLocaleString("en-IN")}</p>
                      </div>
                      <div className="bg-emerald-50 rounded-lg p-2">
                        <p className="text-[10px] text-slate-400">Revenue/mo</p>
                        <p className="text-sm font-semibold text-emerald-700">
                          ₹{idea.monthlyRevenueMin?.toLocaleString("en-IN")} – ₹{idea.monthlyRevenueMax?.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Link to="/auth/planner">
                        <Button size="sm" variant="outline" className="w-full" icon={TrendingUp}>
                          View Growth Plan
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "plans" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">My Growth Plans</h2>
              <Link to="/auth/planner">
                <Button size="sm" icon={TrendingUp}>View All Plans</Button>
              </Link>
            </div>
            {plansLoading ? <Loader /> : !plans?.length ? (
              <Card className="p-12 text-center">
                <TrendingUp size={36} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No growth plans yet</p>
                <p className="text-slate-400 text-sm mt-1 mb-4">Generate ideas first, then create a growth plan for your chosen idea.</p>
                <Link to="/auth/ideas"><Button size="sm">Get Ideas First</Button></Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plans.map((plan) => {
                  const progress = getPlanProgress(plan)
                  return (
                    <Card key={plan._id} className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-800">{plan.idea?.title || "Business Plan"}</h3>
                          <p className="text-xs text-slate-500">{plan.phases?.length || 0} phases</p>
                        </div>
                        <Badge variant={plan.status === "completed" ? "success" : "info"} size="sm" dot>
                          {plan.status === "completed" ? "Completed" : "Active"}
                        </Badge>
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      <Link to={`/auth/planner/${plan._id}`}>
                        <Button size="sm" variant="outline" className="w-full">View Plan Details</Button>
                      </Link>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "mentor" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">Connect with Mentors</h2>
              <Link to="/auth/mentor-apply">
                <Button size="sm" variant="outline">Become a Mentor</Button>
              </Link>
            </div>
            {mentorsLoading ? <Loader /> : !mentors?.length ? (
              <Card className="p-12 text-center">
                <Users size={36} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No mentors available yet</p>
                <p className="text-slate-400 text-sm mt-1">Check back soon or apply to become a mentor yourself.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mentors.map((mentor) => (
                  <Card key={mentor._id} className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-semibold text-emerald-700">
                        {mentor.user?.name?.[0] || "M"}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800">{mentor.user?.name}</h3>
                        <p className="text-sm text-slate-500">{mentor.businessName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{mentor.experience}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {mentor.expertise?.slice(0, 3).map((e) => (
                            <Badge key={e} variant="neutral" size="sm">{e}</Badge>
                          ))}
                        </div>
                        {mentor.consultationFee && (
                          <p className="text-xs text-emerald-700 mt-2 font-medium">
                            ₹{mentor.consultationFee}/session
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDashboardPage

