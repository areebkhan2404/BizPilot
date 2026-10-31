import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../../features/auth/authSlice.js"
import { Rocket, LogOut, LayoutDashboard, Menu, X } from "lucide-react"
import { useState } from "react"
import Button from "../common/Button.jsx"

const Navbar = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/")
  }

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Rocket size={16} className="text-white" />
            </div>
            BizPilot
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/schemes" className="text-sm font-medium text-slate-600 hover:text-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-colors">
              Schemes
            </Link>
            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to={user.userType === "ADMIN" ? "/auth/admin" : "/auth/dashboard"}>
                  <Button variant="outline" size="sm" icon={LayoutDashboard}>
                    Dashboard
                  </Button>
                </Link>
                <Button variant="danger" size="sm" icon={LogOut} onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/schemes" className="block px-3 py-2 text-sm text-slate-600 hover:text-emerald-600" onClick={() => setMenuOpen(false)}>
              Schemes
            </Link>
            {!user ? (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Login</Button>
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">Get Started</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to={user.userType === "ADMIN" ? "/auth/admin" : "/auth/dashboard"} onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full" icon={LayoutDashboard}>Dashboard</Button>
                </Link>
                <Button variant="danger" size="sm" icon={LogOut} onClick={handleLogout} className="w-full">Logout</Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
