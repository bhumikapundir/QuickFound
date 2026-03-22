const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅ correct
  message: String,
  type: String,
  isRead: { type: Boolean, default: false },
  data: {
    claimerName: String,
    claimerId: String,
    contact: String,
    itemTitle: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);