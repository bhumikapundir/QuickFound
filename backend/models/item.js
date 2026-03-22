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

  description: {
    type: String,
    required: false
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

  securityQuestions: [
  {
    question: {
      type: String,
      required: true
    },
    options: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length >= 2
        },
        message: "At least 2 options required"
      }
    },
    correctAnswer: {
      type: Number,
      required: true,
      min: 0
    }
  }
],

  // Flexible key-value pairs e.g. { color: "red", brand: "Nike" }
  extraAttributes: {
    type: Map,
    of: String,
    default: {}
  }

}, { timestamps: true });

itemSchema.pre("save", function (next) {
  if (!this.securityQuestions) return next();
  for (const q of this.securityQuestions) {
    if (q.correctAnswer >= q.options.length) {
      return next(new Error("Correct answer index out of range"));
    }
  }
  next();
});

module.exports = mongoose.model("Item", itemSchema);