import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["collaboration-request", "offer", "comment", "message"],
    required: true,
  },
  title: String,
  message: String,
  relatedStartup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Startup",
  },
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Notification", notificationSchema)
