import axios from "axios"

const API = import.meta.env.VITE_API_URL || ""

const registerUser = async (userData) => {
  const res = await axios.post(`${API}/api/auth/register`, userData)
  return res.data
}

const loginUser = async (credentials) => {
  const res = await axios.post(`${API}/api/auth/login`, credentials)
  return res.data
}

const getMyProfile = async (token) => {
  const res = await axios.get(`${API}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

const updateProfile = async (data, token) => {
  const res = await axios.put(`${API}/api/auth/me`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

const authService = { registerUser, loginUser, getMyProfile, updateProfile }

export default authService
