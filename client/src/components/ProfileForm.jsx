import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useDispatch, useSelector } from "react-redux"
import toast from "react-hot-toast"
import { getProfile } from "../features/auth/authSlice.js"
import authService from "../services/authService.js"
import Input from "./common/Input.jsx"
import Button from "./common/Button.jsx"
import { User, Phone, MapPin, Lock } from "lucide-react"

const ProfileForm = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    city: user?.city || "",
    state: user?.state || "",
    address: user?.address || "",
    age: user?.age || "",
    gender: user?.gender || "",
    password: ""
  })

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => authService.updateProfile(data, user?.token),
    onSuccess: (data) => {
      dispatch(getProfile(data))
      queryClient.invalidateQueries({ queryKey: ["my-profile"] })
      toast.success("Profile updated successfully!")
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something Went Wrong!")
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) {
      toast.error("Name and phone are required!")
      return
    }
    if (formData.password && formData.password.length < 8) {
      toast.error("Password must be at least 8 characters!")
      return
    }
    const payload = { ...formData }
    if (!payload.password) delete payload.password
    mutate(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          name="name"
          placeholder="Your name"
          icon={User}
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Phone"
          name="phone"
          placeholder="10-digit phone"
          icon={Phone}
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <Input
          label="City"
          name="city"
          placeholder="Your city"
          icon={MapPin}
          value={formData.city}
          onChange={handleChange}
        />
        <Input
          label="State"
          name="state"
          placeholder="Your state"
          value={formData.state}
          onChange={handleChange}
        />
        <Input
          label="Address"
          name="address"
          placeholder="Your address"
          value={formData.address}
          onChange={handleChange}
        />
        <Input
          label="Age"
          name="age"
          type="number"
          placeholder="Your age"
          value={formData.age}
          onChange={handleChange}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <Input
          label="New Password (optional)"
          name="password"
          type="password"
          placeholder="Min 8 characters"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <Button type="submit" disabled={isPending} size="md">
        {isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}

export default ProfileForm
