import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import authService from "../../services/authService.js"
import Input from "../../components/common/Input.jsx"
import Button from "../../components/common/Button.jsx"
import Card from "../../components/common/Card.jsx"
import { Mail, Lock, User, Phone, MapPin, Rocket } from "lucide-react"

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    password: ""
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => authService.registerUser(data),
    onSuccess: (data) => {
      toast.success(data.message || "Registered Successfully!")
      navigate("/login")
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong!")
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error("Please fill all required fields!")
      return
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters!")
      return
    }
    mutate(formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl text-slate-800 mb-2">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Rocket size={18} className="text-white" />
            </div>
            BizPilot
          </Link>
          <p className="text-slate-500 text-sm">Create your free account</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              placeholder="Rahul Sharma"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="rahul@example.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Phone Number"
              name="phone"
              placeholder="10-digit mobile number"
              icon={Phone}
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="City"
                name="city"
                placeholder="Indore"
                icon={MapPin}
                value={formData.city}
                onChange={handleChange}
              />
              <Input
                label="State"
                name="state"
                placeholder="MP"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Min 8 characters"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button type="submit" disabled={isPending} size="lg" className="w-full">
              {isPending ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}

export default RegisterPage

