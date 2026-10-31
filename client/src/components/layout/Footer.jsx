import { Link } from "react-router-dom"
import { Rocket } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Rocket size={14} className="text-white" />
              </div>
              BizPilot
            </div>
            <p className="text-sm leading-relaxed">
              AI-powered business planning for India. Start the right business in your city.
            </p>
            <p className="text-xs mt-3 text-slate-500">
              Disclaimer: BizPilot provides AI-generated suggestions for informational purposes only. 
              Verify all information with local authorities and consult a professional before investing.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Features</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/auth/ideas" className="hover:text-white transition-colors">Idea Generator</Link></li>
              <li><Link to="/auth/planner" className="hover:text-white transition-colors">Growth Planner</Link></li>
              <li><Link to="/auth/scheme-finder" className="hover:text-white transition-colors">Scheme Finder</Link></li>
              <li><Link to="/auth/chat" className="hover:text-white transition-colors">AI Chat</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/schemes" className="hover:text-white transition-colors">Govt. Schemes</Link></li>
              <li><Link to="/auth/mentor-apply" className="hover:text-white transition-colors">Become a Mentor</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} BizPilot. Built for Indian entrepreneurs.
        </div>
      </div>
    </footer>
  )
}

export default Footer
