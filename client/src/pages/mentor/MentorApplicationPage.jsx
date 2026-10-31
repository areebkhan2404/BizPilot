import { useState } from "react"
import { useSelector } from "react-redux"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import mentorService from "../../services/mentorService.js"
import Card from "../../components/common/Card.jsx"
import Input from "../../components/common/Input.jsx"
import Button from "../../components/common/Button.jsx"
import { Briefcase, Phone, Mail, Award, X, Plus } from "lucide-react"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const MentorApplicationPage = () => {
  const { user } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    businessName: "",
    address: "",
    qualification: "",
    registrationNumber: "",
    experience: "",
    phone: user?.phone || "",
    email: user?.email || "",
    consultationFee: "",
    workingHours: { start: "09:00", end: "18:00" }
  })
  const [expertise, setExpertise] = useState([])
  const [customExpertise, setCustomExpertise] = useState("")
  const [availableDays, setAvailableDays] = useState([])
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const toggleDay = (day) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const addExpertise = () => {
    if (customExpertise.trim() && !expertise.includes(customExpertise.trim())) {
      setExpertise((prev) => [...prev, customExpertise.trim()])
      setCustomExpertise("")
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => mentorService.applyAsMentor(data, user?.token),
    onSuccess: () => {
      setSubmitted(true)
      toast.success("Application submitted! Admin will review it shortly.")
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong!")
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.businessName || !formData.qualification || !formData.experience) {
      toast.error("Please fill all required fields!")
      return
    }
    mutate({
      ...formData,
      consultationFee: Number(formData.consultationFee),
      expertise,
      availableDays
    })
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="p-10 max-w-md text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award size={28} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Application Submitted!</h2>
          <p className="text-slate-500 text-sm">
            Your mentor application has been submitted. Our admin team will review it and 
            verify your credentials. You'll be notified once approved.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Apply to Become a Mentor</h1>
          <p className="text-slate-500 text-sm">Share your expertise and help other entrepreneurs succeed</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">Business Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Business Name"
                  name="businessName"
                  placeholder="Your business or consultancy name"
                  icon={Briefcase}
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Registration Number (optional)"
                  name="registrationNumber"
                  placeholder="Business registration no."
                  value={formData.registrationNumber}
                  onChange={handleChange}
                />
                <Input
                  label="Qualification"
                  name="qualification"
                  placeholder="e.g. MBA, B.Tech, CA"
                  icon={Award}
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                  className="sm:col-span-2"
                />
                <Input
                  label="Years of Experience"
                  name="experience"
                  placeholder="e.g. 10 years in retail and FMCG"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  className="sm:col-span-2"
                />
                <Input
                  label="Address"
                  name="address"
                  placeholder="Your business address"
                  value={formData.address}
                  onChange={handleChange}
                  className="sm:col-span-2"
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">Areas of Expertise</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g. E-commerce, Food Tech, Retail..."
                  value={customExpertise}
                  onChange={(e) => setCustomExpertise(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addExpertise())}
                  className="flex-1 text-sm rounded-xl border border-slate-200 px-4 py-2.5 focus:border-emerald-500 focus:outline-none"
                />
                <button type="button" onClick={addExpertise} className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100">
                  <Plus size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {expertise.map((e) => (
                  <span key={e} className="inline-flex items-center gap-1.5 text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                    {e}
                    <button type="button" onClick={() => setExpertise((prev) => prev.filter((x) => x !== e))}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {expertise.length === 0 && (
                  <p className="text-xs text-slate-400">Add your areas of expertise</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">Contact & Availability</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone"
                  name="phone"
                  placeholder="Mobile number"
                  icon={Phone}
                  value={formData.phone}
                  onChange={handleChange}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Business email"
                  icon={Mail}
                  value={formData.email}
                  onChange={handleChange}
                />
                <Input
                  label="Consultation Fee (₹/session)"
                  name="consultationFee"
                  type="number"
                  placeholder="e.g. 500"
                  value={formData.consultationFee}
                  onChange={handleChange}
                />
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium text-slate-700 mb-2 block">Available Days</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`text-sm px-3 py-1.5 rounded-full border transition-all ${
                        availableDays.includes(day)
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300"
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Working Hours From</label>
                  <input
                    type="time"
                    value={formData.workingHours.start}
                    onChange={(e) => setFormData((prev) => ({ ...prev, workingHours: { ...prev.workingHours, start: e.target.value } }))}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Working Hours To</label>
                  <input
                    type="time"
                    value={formData.workingHours.end}
                    onChange={(e) => setFormData((prev) => ({ ...prev, workingHours: { ...prev.workingHours, end: e.target.value } }))}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default MentorApplicationPage

