const express = require("express");
const router = express.Router();
const Item = require("../models/item");
const Claim = require("../models/claim");

router.get("/", async (req, res) => {

  const items = await Item.find();

  res.json(items);

});
module.exports = router;

router.post("/claim", async (req, res) => {

  const { itemId, studentId } = req.body;

  try {

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.postedBy === studentId) {
      return res.status(400).json({ message: "You cannot claim your own item" });
    }

    const newClaim = new Claim({
      itemId: item._id,
      claimerId: studentId,
      ownerId: item.postedBy,
      status: "pending"
    });

    await newClaim.save();

    res.json({
      message: "Claim allowed",
      securityQuestions: item.securityQuestions
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});
module.exports = router;