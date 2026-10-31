import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Users, Award, BookOpen, ArrowLeft, Rocket } from "lucide-react"

const NAV_ITEMS = [
  { label: "Dashboard", path: "/auth/admin", icon: LayoutDashboard },
  { label: "All Users", path: "/auth/admin/users", icon: Users },
  { label: "Mentors", path: "/auth/admin/mentors", icon: Award },
  { label: "Schemes", path: "/auth/admin/schemes", icon: BookOpen }
]

const AdminSidebar = () => {
  const location = useLocation()

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen flex-shrink-0">
      {/* Brand */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Rocket size={16} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-base">BizPilot</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-1.5 py-0.5 rounded ml-2 uppercase tracking-wider">
              Admin
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-4 space-y-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Back to App */}
      <div className="p-4 border-t border-slate-800">
        <Link
          to="/auth/dashboard"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft size={16} />
          User Dashboard
        </Link>
      </div>
    </aside>
  )
}

export default AdminSidebar

