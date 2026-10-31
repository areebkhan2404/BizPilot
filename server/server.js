import dns from "dns"
dns.setDefaultResultOrder("ipv4first")
dns.setServers(["8.8.8.8", "8.8.4.4"])

import express from "express"
import dotenv from "dotenv"
import colors from "colors"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"

dotenv.config()

import connectDB from "./config/dbConfig.js"
import authRoutes from "./routes/authRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import aiRoutes from "./routes/aiRoutes.js"
import mentorRoutes from "./routes/mentorRoutes.js"
import planRoutes from "./routes/planRoutes.js"
import schemeRoutes from "./routes/schemeRoutes.js"
import errorHandler from "./middleware/errorHandler.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 5000

connectDB()

const app = express()

app.use(
    cors({
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        credentials: true
    })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, "../client/dist")))

app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/mentor", mentorRoutes)
app.use("/api/plans", planRoutes)
app.use("/api/schemes", schemeRoutes)

app.get("/{*path}", (req, res) => {
    if (process.env.NODE_ENV === "production") {
        res.sendFile(path.join(__dirname, "../client/dist/index.html"))
    } else {
        res.send("Project is Running in Dev Enviroment For Frontend Go To PORT : 5173")
    }
})

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue)
})
