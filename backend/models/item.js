const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,

  category: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ["lost", "found"],
    required: true
  },

  attributes: {
    color: String,
    brand: String,
    model: String,
    uniqueMarks: String
  },

  location: {
    type: String,
    required: true
  },

  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  status: {
    type: String,
    enum: ["open", "claimed", "closed"],
    default: "open"
  }

}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);