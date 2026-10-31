import { createSlice } from "@reduxjs/toolkit"

const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user")
    if (user && user !== "undefined") {
      return JSON.parse(user)
    }
    return null
  } catch (e) {
    localStorage.removeItem("user")
    return null
  }
}

const initialState = {
  user: getStoredUser()
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    register: (state, action) => {
      state.user = action.payload
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload))
      }
    },
    getProfile: (state, action) => {
      // Merge profile data but keep the token
      const token = state.user?.token
      state.user = { ...action.payload, token }
      localStorage.setItem("user", JSON.stringify(state.user))
    },
    logout: (state) => {
      state.user = null
      localStorage.removeItem("user")
    }
  }
})

export const { register, getProfile, logout } = authSlice.actions
export default authSlice.reducer