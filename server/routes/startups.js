import express from "express"
import { authenticateToken } from "../middleware/auth.js"
import Startup from "../models/Startup.js"

const router = express.Router()

// Get all startups with filtering
router.get("/", async (req, res) => {
  try {
    const { category, status, search } = req.query
    const query = {}

    if (category) query.category = category
    if (status) query.status = status
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    const startups = await Startup.find(query).populate("founder", "name avatar").sort({ createdAt: -1 })

    res.json(startups)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single startup
router.get("/:id", async (req, res) => {
  try {
    const startup = await Startup.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true }).populate(
      "founder",
      "name avatar bio",
    )

    if (!startup) {
      return res.status(404).json({ error: "Startup not found" })
    }

    res.json(startup)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create startup (authenticated)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, description, failureReason, techStack, repositoryUrl, images, category, tags, buyoutPrice } =
      req.body

    const startup = new Startup({
      title,
      description,
      failureReason,
      techStack,
      repositoryUrl,
      images,
      category,
      tags,
      buyoutPrice,
      founder: req.user.id,
    })

    await startup.save()
    await startup.populate("founder", "name avatar")

    res.status(201).json(startup)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update startup (authenticated)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id)

    if (!startup) {
      return res.status(404).json({ error: "Startup not found" })
    }

    if (startup.founder.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this startup" })
    }

    Object.assign(startup, req.body)
    await startup.save()

    res.json(startup)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete startup (authenticated)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id)

    if (!startup) {
      return res.status(404).json({ error: "Startup not found" })
    }

    if (startup.founder.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to delete this startup" })
    }

    await Startup.findByIdAndDelete(req.params.id)

    res.json({ message: "Startup deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
