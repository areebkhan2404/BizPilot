import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"

const PrivateComponent = () => {
  const { user } = useSelector((state) => state.auth)
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Admin routes protection
  const adminPaths = ["/auth/admin", "/auth/admin/users", "/auth/admin/mentors", "/auth/admin/schemes"]
  const isAdminRoute = adminPaths.some((path) => location.pathname.startsWith("/auth/admin"))
  if (isAdminRoute && user.userType !== "ADMIN") {
    return <Navigate to="/auth/dashboard" replace />
  }

  return <Outlet />
}

export default PrivateComponent
