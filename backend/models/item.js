const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  type:     { type: String, enum: ["lost", "found"], required: true },
  status:   { type: String, enum: ["active", "claimed", "resolved"], default: "active" },
  category: { type: String },
  description: { type: String },
  location: { type: String, required: true },
  date:     { type: String },
  imageUrl: { type: String },
  securityQuestions: [
    {
      question: { type: String },
      options:  [{ type: String }],
      correctAnswer: { type: Number }
    }
  ],
  extraAttributes:  { type: Object, default: {} },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);