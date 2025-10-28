import mongoose from "mongoose"

const discussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    enum: ["general", "tips", "success-stories", "help"],
    default: "general",
  },
  replies: [
    {
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      content: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Discussion", discussionSchema)
