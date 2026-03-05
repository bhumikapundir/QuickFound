const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["lost", "found"],
    required: true
  },
  category:{
    type: String
  },
  description: {
    color: String,
    brand: String,
    model: String,
    uniqueMarks: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);