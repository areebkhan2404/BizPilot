import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, Link } from "react-router-dom"
import toast from "react-hot-toast"
import planService from "../../services/planService.js"
import Card from "../../components/common/Card.jsx"
import Badge from "../../components/common/Badge.jsx"
import Button from "../../components/common/Button.jsx"
import Loader from "../../components/common/Loader.jsx"
import { TrendingUp, ArrowLeft, Target } from "lucide-react"

const PlanDetail = ({ plid }) => {
  const { user } = useSelector((state) => state.auth)
  const queryClient = useQueryClient()

  const { data: plan, isLoading, error } = useQuery({
    queryKey: ["plan-detail", plid],
    queryFn: () => planService.getPlan(plid, user?.token),
    enabled: !!plid && !!user?.token
  })

  const { mutate: updateTask } = useMutation({
    mutationFn: (payload) => planService.updateTask(payload, user?.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan-detail", plid] })
      queryClient.invalidateQueries({ queryKey: ["my-plans"] })
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong!")
    }
  })

  useEffect(() => {
    if (error) toast.error(error?.response?.data?.message || "Something Went Wrong!")
  }, [error])

  if (isLoading) return <Loader />
  if (!plan) return <div className="text-center text-slate-500 py-20">Plan not found.</div>

  const totalTasks = plan.phases?.reduce((acc, p) => acc + (p.tasks?.length || 0), 0) || 0
  const doneTasks = plan.phases?.reduce((acc, p) => acc + (p.tasks?.filter((t) => t.isDone)?.length || 0), 0) || 0
  const progress = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{plan.idea?.title || "Growth Plan"}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{plan.phases?.length || 0} phases · {totalTasks} tasks</p>
          </div>
          <Badge variant={plan.status === "completed" ? "success" : "info"} dot>
            {plan.status === "completed" ? "Completed" : "Active"}
          </Badge>
        </div>
        <div>
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span className="font-medium">Overall Progress</span>
            <span className="font-bold text-emerald-600">{progress}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">{doneTasks} of {totalTasks} tasks completed</p>
        </div>
      </Card>

      {/* Phases */}
      {plan.phases?.map((phase, phaseIndex) => {
        const phaseDone = phase.tasks?.filter((t) => t.isDone)?.length || 0
        const phaseTotal = phase.tasks?.length || 0
        const phaseProgress = phaseTotal ? Math.round((phaseDone / phaseTotal) * 100) : 0
        return (
          <Card key={phaseIndex} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-bold text-sm">
                  {phaseIndex + 1}
                </div>
                <h3 className="font-semibold text-slate-800">{phase.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{phaseDone}/{phaseTotal}</span>
                <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${phaseProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {phase.goals?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Goals</p>
                <ul className="space-y-1.5">
                  {phase.goals.map((goal, gi) => (
                    <li key={gi} className="flex items-start gap-2 text-sm text-slate-600">
                      <Target size={13} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Tasks</p>
              <div className="space-y-2">
                {phase.tasks?.map((task, taskIndex) => (
                  <label
                    key={taskIndex}
                    className="flex items-start gap-3 cursor-pointer group p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={task.isDone}
                      onChange={() =>
                        updateTask({
                          plid: plan._id,
                          phaseIndex,
                          taskIndex,
                          isDone: !task.isDone
                        })
                      }
                      className="mt-0.5 w-4 h-4 accent-emerald-600 flex-shrink-0"
                    />
                    <span
                      className={`text-sm leading-relaxed transition-colors ${
                        task.isDone ? "line-through text-slate-400" : "text-slate-700"
                      }`}
                    >
                      {task.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </Card>
        )
      })}

      <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <strong>Disclaimer:</strong> This growth plan is AI-generated based on general business principles. 
        Adapt it to your specific local market conditions and consult local mentors or a CA for financial and legal guidance.
      </div>
    </div>
  )
}

const GrowthPlannerPage = () => {
  const { user } = useSelector((state) => state.auth)
  const { plid } = useParams()

  const { data: plans, isLoading, error } = useQuery({
    queryKey: ["my-plans"],
    queryFn: () => planService.getPlans(user?.token),
    enabled: !plid && !!user?.token
  })

  useEffect(() => {
    if (error) toast.error(error?.response?.data?.message || "Something Went Wrong!")
  }, [error])

  const getPlanProgress = (plan) => {
    const total = plan.phases?.reduce((acc, p) => acc + (p.tasks?.length || 0), 0) || 0
    const done = plan.phases?.reduce((acc, p) => acc + (p.tasks?.filter((t) => t.isDone)?.length || 0), 0) || 0
    return total ? Math.round((done / total) * 100) : 0
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {plid ? (
          <>
            <div className="mb-6">
              <Link to="/auth/planner">
                <Button variant="outline" size="sm" icon={ArrowLeft}>Back to Plans</Button>
              </Link>
            </div>
            <PlanDetail plid={plid} />
          </>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Growth Plans</h1>
                <p className="text-slate-500 text-sm mt-1">Track your business growth milestones</p>
              </div>
              <Link to="/auth/ideas">
                <Button size="sm" icon={TrendingUp}>Generate Idea First</Button>
              </Link>
            </div>

            {isLoading ? (
              <Loader />
            ) : !plans?.length ? (
              <Card className="p-12 text-center">
                <TrendingUp size={40} className="text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No growth plans yet</p>
                <p className="text-sm text-slate-400 mt-1 mb-5">
                  Generate a business idea and click "Create Growth Plan" to get started.
                </p>
                <Link to="/auth/ideas">
                  <Button size="sm">Go to Idea Generator</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {plans.map((plan) => {
                  const progress = getPlanProgress(plan)
                  return (
                    <Link key={plan._id} to={`/auth/planner/${plan._id}`}>
                      <Card hoverEffect className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-slate-800">{plan.idea?.title || "Business Plan"}</h3>
                            <p className="text-xs text-slate-500 mt-0.5">{plan.phases?.length} phases</p>
                          </div>
                          <Badge variant={plan.status === "completed" ? "success" : "info"} dot size="sm">
                            {plan.status === "completed" ? "Done" : "Active"}
                          </Badge>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Progress</span>
                            <span className="font-semibold">{progress}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default GrowthPlannerPage

