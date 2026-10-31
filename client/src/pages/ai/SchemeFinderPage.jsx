import { useState } from "react"
import { useSelector } from "react-redux"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import schemeService from "../../services/schemeService.js"
import Card from "../../components/common/Card.jsx"
import Badge from "../../components/common/Badge.jsx"
import Button from "../../components/common/Button.jsx"
import Input from "../../components/common/Input.jsx"
import Loader from "../../components/common/Loader.jsx"
import { Search, ExternalLink, BookOpen, FileText, AlertTriangle, Clock } from "lucide-react"

const SchemeFinderPage = () => {
  const { user } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    businessType: "",
    state: user?.state || "",
    city: user?.city || "",
    launchDate: ""
  })
  const [result, setResult] = useState(null)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => schemeService.searchSchemes(data, user?.token),
    onSuccess: (data) => {
      setResult(data)
      if (!data.schemes?.length) {
        toast("No schemes found for your criteria. Try broader terms.", { icon: "ℹ️" })
      } else {
        toast.success(`Found ${data.schemes.length} scheme${data.schemes.length !== 1 ? "s" : ""}!`)
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong!")
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.businessType || !formData.state || !formData.launchDate) {
      toast.error("Please fill business type, state, and launch date!")
      return
    }
    mutate(formData)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Government Scheme Finder</h1>
          <p className="text-slate-500 text-sm">Search for active government schemes that match your business type and state</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Business Type"
                  name="businessType"
                  placeholder="e.g. Cloud Kitchen, Retail Shop"
                  icon={FileText}
                  value={formData.businessType}
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
                  label="City (optional)"
                  name="city"
                  placeholder="e.g. Indore"
                  value={formData.city}
                  onChange={handleChange}
                />
                <Input
                  label="Planned Launch Date"
                  name="launchDate"
                  type="date"
                  value={formData.launchDate}
                  onChange={handleChange}
                  required
                />
                <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700">
                  <AlertTriangle size={12} className="inline mr-1" />
                  AI searches live web for real schemes. Results may take 10–20 seconds.
                </div>
                <Button type="submit" size="lg" className="w-full" variant="ai" icon={Search} disabled={isPending}>
                  {isPending ? "Searching..." : "Find Schemes"}
                </Button>
              </form>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-5">
            {isPending && (
              <Card className="p-10 text-center">
                <Search size={36} className="text-violet-300 mx-auto mb-3 animate-pulse" />
                <p className="font-medium text-slate-700">Searching government portals...</p>
                <p className="text-sm text-slate-500 mt-1">Using AI + Google Search to find active schemes</p>
                <Loader />
              </Card>
            )}

            {!isPending && !result && (
              <Card className="p-10 text-center">
                <FileText size={40} className="text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Fill the form to search for schemes</p>
                <p className="text-sm text-slate-400 mt-1">We'll find active schemes with verified source links</p>
              </Card>
            )}

            {result && !isPending && (
              <>
                {result.fromCache && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 rounded-xl px-4 py-2">
                    <Clock size={12} />
                    Showing cached results from {new Date(result.lastChecked).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                )}

                {!result.schemes?.length ? (
                  <Card className="p-10 text-center">
                    <FileText size={36} className="text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No matching schemes found</p>
                    <p className="text-sm text-slate-400 mt-1">
                      Try using broader terms (e.g. "food business" instead of "cloud kitchen") or check the curated list below.
                    </p>
                  </Card>
                ) : (
                  result.schemes.map((scheme, idx) => (
                    <Card key={idx} className="p-5 animate-fade-in">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="font-semibold text-slate-800 leading-snug">{scheme.name}</h3>
                        <Badge variant="success" size="sm" dot>Active</Badge>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Benefit</p>
                          <p className="text-sm text-slate-700">{scheme.benefit}</p>
                        </div>
                        {scheme.eligibility && (
                          <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Eligibility</p>
                            <p className="text-sm text-slate-600">{scheme.eligibility}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {scheme.applyUrl && (
                          <a href={scheme.applyUrl} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="primary" icon={ExternalLink}>Apply Now</Button>
                          </a>
                        )}
                        {scheme.sourceUrl && (
                          <a href={scheme.sourceUrl} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline" icon={BookOpen}>Official Source</Button>
                          </a>
                        )}
                      </div>
                      {result.lastChecked && (
                        <p className="text-[10px] text-slate-400 mt-3">
                          Last checked: {new Date(result.lastChecked).toLocaleDateString("en-IN")}
                        </p>
                      )}
                    </Card>
                  ))
                )}

                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
                  <strong>Important:</strong> Always verify scheme eligibility and details on the official government portal before applying. 
                  Scheme availability and terms may change. BizPilot is not responsible for inaccuracies.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SchemeFinderPage

