import { useSelector } from "react-redux"
import { useQuery } from "@tanstack/react-query"
import adminService from "../../services/adminService.js"
import AdminSidebar from "../../components/admin/AdminSidebar.jsx"
import Card from "../../components/common/Card.jsx"
import Badge from "../../components/common/Badge.jsx"
import Loader from "../../components/common/Loader.jsx"
import { Users, Award, BookOpen, Lightbulb } from "lucide-react"
import { Link } from "react-router-dom"

const AdminDashboardPage = () => {
  const { user } = useSelector((state) => state.auth)

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => adminService.getAllUsers(user?.token),
    enabled: !!user?.token
  })

  const { data: mentors, isLoading: mentorsLoading } = useQuery({
    queryKey: ["admin-mentors"],
    queryFn: () => adminService.getAllMentors(user?.token),
    enabled: !!user?.token
  })

  const { data: ideas, isLoading: ideasLoading } = useQuery({
    queryKey: ["admin-ideas"],
    queryFn: () => adminService.getAllIdeas(user?.token),
    enabled: !!user?.token
  })

  const { data: schemes, isLoading: schemesLoading } = useQuery({
    queryKey: ["admin-schemes"],
    queryFn: () => adminService.getAllSchemes(user?.token),
    enabled: !!user?.token
  })

  const isLoading = usersLoading || mentorsLoading || ideasLoading || schemesLoading

  const pendingMentors = mentors?.filter((m) => !m.isVerified)?.length || 0
  const verifiedMentors = mentors?.filter((m) => m.isVerified)?.length || 0

  const stats = [
    { label: "Total Users", count: users?.length || 0, icon: Users, color: "emerald", link: "/auth/admin/users" },
    { label: "Verified Mentors", count: verifiedMentors, icon: Award, color: "blue", link: "/auth/admin/mentors" },
    { label: "Pending Approvals", count: pendingMentors, icon: Award, color: "amber", link: "/auth/admin/mentors" },
    { label: "Active Schemes", count: schemes?.filter((s) => s.isActive)?.length || 0, icon: BookOpen, color: "purple", link: "/auth/admin/schemes" }
  ]

  const colorClasses = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-violet-50 text-violet-600"
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-x-hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Platform overview and management</p>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <Link key={stat.label} to={stat.link}>
                    <Card hoverEffect className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-slate-400 mb-1">{stat.label}</p>
                          <p className="text-3xl font-bold text-slate-800">{stat.count}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[stat.color]}`}>
                          <Icon size={22} />
                        </div>
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>

            {/* Recent Mentors Awaiting Approval */}
            {pendingMentors > 0 && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-800">Mentors Awaiting Verification</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{pendingMentors} pending application(s)</p>
                  </div>
                  <Link to="/auth/admin/mentors" className="text-xs text-emerald-600 font-medium hover:underline">
                    View all
                  </Link>
                </div>
                <div className="space-y-3">
                  {mentors?.filter((m) => !m.isVerified).slice(0, 3).map((mentor) => (
                    <div key={mentor._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{mentor.user?.name}</p>
                        <p className="text-xs text-slate-500">{mentor.businessName} · {mentor.qualification}</p>
                      </div>
                      <Badge variant="warning" size="sm" dot>Pending</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Recent Generated Ideas */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-slate-800">Platform Activity Summary</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-2xl font-bold text-slate-800">{ideas?.length || 0}</p>
                  <p className="text-xs text-slate-500 mt-1">Total Ideas Generated</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-2xl font-bold text-slate-800">{schemes?.length || 0}</p>
                  <p className="text-xs text-slate-500 mt-1">Total Schemes in DB</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-2xl font-bold text-slate-800">{mentors?.length || 0}</p>
                  <p className="text-xs text-slate-500 mt-1">Total Mentor Applications</p>
                </div>
              </div>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}

export default AdminDashboardPage

