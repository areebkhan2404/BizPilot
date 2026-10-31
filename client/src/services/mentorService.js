import axios from "axios"

const API = import.meta.env.VITE_API_URL

const getMentors = async () => {
  const res = await axios.get(`${API}/api/mentor`)
  return res.data
}

const applyAsMentor = async (data, token) => {
  const res = await axios.post(`${API}/api/mentor/request`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

const mentorService = { getMentors, applyAsMentor }

export default mentorService
