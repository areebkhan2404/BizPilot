import axios from "axios"

const API = import.meta.env.VITE_API_URL

const generatePlan = async (iid, data, token) => {
  const res = await axios.post(`${API}/api/plans/${iid}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

const getPlans = async (token) => {
  const res = await axios.get(`${API}/api/plans`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

const getPlan = async (plid, token) => {
  const res = await axios.get(`${API}/api/plans/${plid}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

const updateTask = async ({ plid, phaseIndex, taskIndex, isDone }, token) => {
  const res = await axios.put(
    `${API}/api/plans/${plid}/tasks`,
    { phaseIndex, taskIndex, isDone },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.data
}

const planService = { generatePlan, getPlans, getPlan, updateTask }

export default planService
