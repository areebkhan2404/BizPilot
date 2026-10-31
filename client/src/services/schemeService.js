import axios from "axios"

const API = import.meta.env.VITE_API_URL

const searchSchemes = async (data, token) => {
  const res = await axios.post(`${API}/api/schemes/search`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

const getCuratedSchemes = async () => {
  const res = await axios.get(`${API}/api/schemes`)
  return res.data
}

const schemeService = { searchSchemes, getCuratedSchemes }

export default schemeService
