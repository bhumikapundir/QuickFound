const mongoose = require("mongoose")

const claimSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
  claimerId: String,
  ownerId: String,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Claim", claimSchema)