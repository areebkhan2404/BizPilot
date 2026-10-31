import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { useDispatch } from "react-redux"
import toast from "react-hot-toast"
import { register } from "../../features/auth/authSlice.js"
import authService from "../../services/authService.js"
import Input from "../../components/common/Input.jsx"
import Button from "../../components/common/Button.jsx"
import Card from "../../components/common/Card.jsx"
import { Mail, Lock, Rocket } from "lucide-react"

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => authService.loginUser(data),
    onSuccess: (data) => {
      dispatch(register(data))
      toast.success(`Welcome back, ${data.name}!`)
      if (data.userType === "ADMIN") {
        navigate("/auth/admin")
      } else {
        navigate("/auth/dashboard")
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong!")
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      toast.error("Please fill all details!")
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
          <p className="text-slate-500 text-sm">Sign in to your account</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Your password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button type="submit" disabled={isPending} size="lg" className="w-full">
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-emerald-600 font-medium hover:underline">
              Create one
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage

