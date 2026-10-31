import axios from "axios"

const API = import.meta.env.VITE_API_URL

const getAllUsers = async (token) => {
  const res = await axios.get(`${API}/api/admin/users`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

const getAllMentors = async (token) => {
  const res = await axios.get(`${API}/api/admin/mentors`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

const getAllIdeas = async (token) => {
  const res = await axios.get(`${API}/api/admin/ideas`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

const getAllSchemes = async (token) => {
  const res = await axios.get(`${API}/api/admin/schemes`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

const createScheme = async (data, token) => {
  const res = await axios.post(`${API}/api/admin/scheme`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

const updateScheme = async (sid, data, token) => {
  const res = await axios.put(`${API}/api/admin/scheme/${sid}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

const updateMentor = async (mid, data, token) => {
  const res = await axios.put(`${API}/api/admin/mentor/${mid}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

const updateUser = async (uid, data, token) => {
  const res = await axios.put(`${API}/api/admin/user/${uid}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

const adminService = {
  getAllUsers,
  getAllMentors,
  getAllIdeas,
  getAllSchemes,
  createScheme,
  updateScheme,
  updateMentor,
  updateUser
}

export default adminService
