const Claim = require("../models/claim");
const Item = require("../models/item");

exports.createClaim = async (req, res) => {
  try {
    const { itemId, answers } = req.body;
    const userId = "69a67a02b27d6eec12c7a56b"; // later from auth middleware

    // 1️⃣ Check if item exists
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 2️⃣ Check if item already claimed
    if (item.status !== "open") {
      return res.status(400).json({ message: "Item already claimed" });
    }

    // 3️⃣ Check if user already claimed this item
    const existingClaim = await Claim.findOne({
      item: itemId,
      claimedBy: userId
    });

    if (existingClaim) {
      return res.status(400).json({
        message: "You already claimed this item"
      });
    }

    // 4️⃣ Create claim
    const newClaim = await Claim.create({
      item: itemId,
      claimedBy: userId,
      answers
    });

    res.status(201).json(newClaim);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};