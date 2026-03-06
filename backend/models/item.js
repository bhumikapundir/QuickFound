const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  // "lost" or "found" — what the frontend sends as `type`
  type: {
    type: String,
    enum: ["lost", "found"],
    required: true
  },

  // "active", "claimed", "resolved" — separate from type
  status: {
    type: String,
    enum: ["active", "claimed", "resolved"],
    default: "active"
  },

  title: {
    type: String,
    required: true
  },

  // Plain string — frontend sends description as a simple text field
  description: {
    type: String,
    required: true
  },

  category: {
    type: String,
    enum: ["electronics", "clothing", "accessories", "documents", "keys", "bags", "stationery", "sports", "other"],
    default: "other"
  },

  location: {
    type: String,
    required: true
  },

  date: {
    type: String
  },

  imageUrl: {
    type: String,
    default: ""
  },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  securityQuestion: {
    type: String,
    default: ""
  },

  securityAnswer: {
    type: String,
    default: ""
  },

  // Flexible key-value pairs e.g. { color: "red", brand: "Nike" }
  extraAttributes: {
    type: Map,
    of: String,
    default: {}
  }

}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);