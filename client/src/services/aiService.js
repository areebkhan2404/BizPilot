import axios from "axios"

const API = import.meta.env.VITE_API_URL

const generateIdeas = async (data, token) => {
  const res = await axios.post(`${API}/api/ai/ideas`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

const getIdeas = async (token) => {
  const res = await axios.get(`${API}/api/ai/ideas`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

const toggleSaveIdea = async (iid, token) => {
  const res = await axios.put(`${API}/api/ai/ideas/${iid}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

const sendChatMessage = async (data, token) => {
  const res = await axios.post(`${API}/api/ai/chat`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

const getChatHistory = async (sessionId, token) => {
  const res = await axios.get(`${API}/api/ai/chat/${sessionId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

const aiService = { generateIdeas, getIdeas, toggleSaveIdea, sendChatMessage, getChatHistory }

export default aiService
