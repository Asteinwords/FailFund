import express from "express"
import { authenticateToken } from "../middleware/auth.js"
import Discussion from "../models/Discussion.js"

const router = express.Router()

// Get all discussions
router.get("/", async (req, res) => {
  try {
    const { category } = req.query
    const query = category ? { category } : {}

    const discussions = await Discussion.find(query)
      .populate("author", "name avatar")
      .populate("replies.author", "name avatar")
      .sort({ createdAt: -1 })

    res.json(discussions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single discussion
router.get("/:id", async (req, res) => {
  try {
    const discussion = await Discussion.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true })
      .populate("author", "name avatar bio")
      .populate("replies.author", "name avatar")

    if (!discussion) {
      return res.status(404).json({ error: "Discussion not found" })
    }

    res.json(discussion)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create discussion (authenticated)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, content, category } = req.body

    const discussion = new Discussion({
      title,
      content,
      category,
      author: req.user.id,
    })

    await discussion.save()
    await discussion.populate("author", "name avatar")

    res.status(201).json(discussion)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Add reply to discussion (authenticated)
router.post("/:id/replies", authenticateToken, async (req, res) => {
  try {
    const { content } = req.body

    const discussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          replies: {
            author: req.user.id,
            content,
          },
        },
      },
      { new: true },
    )
      .populate("author", "name avatar")
      .populate("replies.author", "name avatar")

    if (!discussion) {
      return res.status(404).json({ error: "Discussion not found" })
    }

    res.json(discussion)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})



export default router