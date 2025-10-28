import mongoose from "mongoose"

const startupSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  failureReason: String,
  techStack: [String],
  repositoryUrl: String,
  images: [String],
  founder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  revivalScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  status: {
    type: String,
    enum: ["available", "in-collaboration", "sold"],
    default: "available",
  },
  collaborators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  buyoutPrice: Number,
  category: String,
  tags: [String],
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Startup", startupSchema)
