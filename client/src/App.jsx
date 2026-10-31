import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"
import { useSelector } from "react-redux"

import Navbar from "./components/layout/Navbar.jsx"
import Footer from "./components/layout/Footer.jsx"
import PrivateComponent from "./components/PrivateComponent.jsx"

import LandingPage from "./pages/LandingPage.jsx"
import LoginPage from "./pages/auth/LoginPage.jsx"
import RegisterPage from "./pages/auth/RegisterPage.jsx"
import UserDashboardPage from "./pages/dashboard/UserDashboardPage.jsx"
import AiHubPage from "./pages/ai/AiHubPage.jsx"
import IdeaGeneratorPage from "./pages/ai/IdeaGeneratorPage.jsx"
import GrowthPlannerPage from "./pages/ai/GrowthPlannerPage.jsx"
import SchemeFinderPage from "./pages/ai/SchemeFinderPage.jsx"
import AiChatPage from "./pages/ai/AiChatPage.jsx"
import MentorApplicationPage from "./pages/mentor/MentorApplicationPage.jsx"
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx"
import AdminAllUsersPage from "./pages/admin/AdminAllUsersPage.jsx"
import AdminMentorsPage from "./pages/admin/AdminMentorsPage.jsx"
import AdminSchemesPage from "./pages/admin/AdminSchemesPage.jsx"

import { useQuery } from "@tanstack/react-query"
import schemeService from "./services/schemeService.js"
import Card from "./components/common/Card.jsx"
import Badge from "./components/common/Badge.jsx"
import Loader from "./components/common/Loader.jsx"
import Button from "./components/common/Button.jsx"
import { ExternalLink, BookOpen } from "lucide-react"

const PublicSchemesPage = () => {
  const { data: schemes, isLoading, error } = useQuery({
    queryKey: ["public-schemes"],
    queryFn: () => schemeService.getCuratedSchemes()
  })

  if (isLoading) return <div className="min-h-screen"><Loader /></div>
  if (error) return <div className="min-h-screen flex items-center justify-center text-slate-500">Failed to load schemes.</div>

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-3">Government Schemes for Entrepreneurs</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Curated list of central government schemes to help you start and grow your business.
            Always verify on the official portal before applying.
          </p>
        </div>
        {!schemes?.length ? (
          <div className="text-center py-20 text-slate-400">No schemes available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {schemes.filter(s => s.isActive).map((scheme) => (
              <Card key={scheme._id} className="p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-800 text-sm leading-snug">{scheme.name}</h3>
                  <Badge variant="success" size="sm">Active</Badge>
                </div>
                <p className="text-sm text-slate-600">{scheme.benefit}</p>
                {scheme.eligibility && (
                  <p className="text-xs text-slate-500"><span className="font-medium">Eligibility:</span> {scheme.eligibility}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-auto pt-2">
                  {scheme.applyUrl && (
                    <a href={scheme.applyUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="primary" size="sm" icon={ExternalLink}>Apply</Button>
                    </a>
                  )}
                  {scheme.sourceUrl && (
                    <a href={scheme.sourceUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" icon={BookOpen}>Source</Button>
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
        <p className="text-center text-xs text-slate-400 mt-10">
          Verify all scheme details on official government portals before applying. BizPilot is not responsible for accuracy of scheme information.
        </p>
      </div>
    </div>
  )
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5
    }
  }
})

const AppContent = () => {
  const { user } = useSelector((state) => state.auth)

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/schemes" element={<PublicSchemesPage />} />

        {/* Private routes */}
        <Route path="/auth" element={<PrivateComponent />}>
          <Route path="dashboard" element={<UserDashboardPage />} />
          <Route path="ai-hub" element={<AiHubPage />} />
          <Route path="ideas" element={<IdeaGeneratorPage />} />
          <Route path="planner" element={<GrowthPlannerPage />} />
          <Route path="planner/:plid" element={<GrowthPlannerPage />} />
          <Route path="scheme-finder" element={<SchemeFinderPage />} />
          <Route path="chat" element={<AiChatPage />} />
          <Route path="mentor-apply" element={<MentorApplicationPage />} />
          <Route path="admin" element={<AdminDashboardPage />} />
          <Route path="admin/users" element={<AdminAllUsersPage />} />
          <Route path="admin/mentors" element={<AdminMentorsPage />} />
          <Route path="admin/schemes" element={<AdminSchemesPage />} />
        </Route>
      </Routes>
      {user?.userType !== "ADMIN" && <Footer />}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </Router>
  )
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppContent />
  </QueryClientProvider>
)

export default App

