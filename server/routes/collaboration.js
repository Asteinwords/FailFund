// server/routes/collaborations.js
import express from "express"
import { authenticateToken } from "../middleware/auth.js"
import Collaboration from "../models/Collaboration.js"
import Startup from "../models/Startup.js"
import Notification from "../models/Notification.js"

const router = express.Router()

// CREATE COLLABORATION / OFFER
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { startupId, type, message, offerAmount } = req.body

    // VALIDATION
    if (!startupId || !type || !message) {
      return res.status(400).json({ error: "Missing required fields" })
    }
    if (!["collaborate", "offer"].includes(type)) {
      return res.status(400).json({ error: "Invalid type" })
    }

    const startup = await Startup.findById(startupId).populate("founder")
    if (!startup) return res.status(404).json({ error: "Startup not found" })

    if (startup.founder._id.toString() === req.user.id) {
      return res.status(400).json({ error: "Cannot request your own startup" })
    }

    const collab = new Collaboration({
      startup: startupId,
      requester: req.user.id,
      type,
      message,
      offerAmount: type === "offer" ? offerAmount : undefined,
    })
    await collab.save()

    // NOTIFY FOUNDER
    const notif = new Notification({
      recipient: startup.founder._id,
      type: type === "collaborate" ? "collaboration-request" : "offer",
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Request`,
      message: `${req.user.name} wants to ${type} on "${startup.title}"`,
      relatedStartup: startupId,
      relatedUser: req.user.id,
    })
    await notif.save()

    res.status(201).json(collab)
  } catch (err) {
    console.error("Collaboration error:", err)
    res.status(500).json({ error: err.message })
  }
})

// GET INCOMING (for founder dashboard)
router.get("/incoming", authenticateToken, async (req, res) => {
  try {
    const startups = await Startup.find({ founder: req.user.id }).select("_id")
    const requests = await Collaboration.find({
      startup: { $in: startups.map(s => s._id) },
      status: "pending",
    })
      .populate("requester", "name email")
      .populate("startup", "title buyoutPrice")
      .sort({ createdAt: -1 })
    res.json(requests)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router