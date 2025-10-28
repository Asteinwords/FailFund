import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"
import startupRoutes from "./routes/startups.js"
import collaborationRoutes from "./routes/collaboration.js"
import notificationRoutes from "./routes/notifications.js"
import discussionRoutes from "./routes/discussions.js"
dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ limit: "50mb", extended: true }))

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/startups", startupRoutes)
app.use("/api/collaborations", collaborationRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/discussions", discussionRoutes)
// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
