import express from "express"
import { authenticateToken } from "../middleware/auth.js"
import Notification from "../models/Notification.js"

const router = express.Router()

// GET UNREAD COUNT
router.get("/unread-count", authenticateToken, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.id,
      read: false,
    })
    res.json({ count })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET NOTIFICATIONS
router.get("/", authenticateToken, async (req, res) => {
  try {
    const notifs = await Notification.find({ recipient: req.user.id })
      .populate("relatedUser", "name avatar")
      .populate("relatedStartup", "title")
      .sort({ createdAt: -1 })
      .limit(10)
    res.json(notifs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// MARK AS READ
router.patch("/:id/read", authenticateToken, async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id)
    if (!notif || notif.recipient.toString() !== req.user.id) {
      return res.status(404).json({ error: "Not found" })
    }
    notif.read = true
    await notif.save()
    res.json(notif)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router