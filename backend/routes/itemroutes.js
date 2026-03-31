const express = require("express");
const router = express.Router();
const Item = require("../models/item");
const Claim = require("../models/claim");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const upload = require("../middleware/upload");

// GET all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().populate("postedBy", "name email studentId");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create item
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const user = req.user; // you'll need auth middleware, see note below
    const {
      type, title, description, category,
      location, date, securityQuestion, securityAnswer, extraAttributes
    } = req.body;

    let imageUrl = "";
    if (req.file) {
      const streamUpload = () => new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "quickfound_items" },
          (error, result) => result ? resolve(result) : reject(error)
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      const result = await streamUpload();
      imageUrl = result.secure_url;
    }

    const newItem = await Item.create({
      title,
      type,           // frontend sends "type" 
      status: "active",
      category,
      description,
      location,
      date,
      imageUrl,
      securityQuestion,
      securityAnswer,
      extraAttributes: extraAttributes ? JSON.parse(extraAttributes) : {},
      postedBy: req.headers["x-user-id"] // temporary until you add JWT middleware
    });

    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message, message: err.message });
  }
});

// GET my items
router.get("/mine", async (req, res) => {
  const userId = req.headers["x-user-id"];
  try {
    const items = await Item.find({ postedBy: userId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single item
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("postedBy", "name email studentId");
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE item
router.delete("/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST claim
router.post("/:id/claim", async (req, res) => {
  const { securityAnswer, message } = req.body;
  const userId = req.headers["x-user-id"];
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const newClaim = await Claim.create({
      item: item._id,
      claimedBy: userId,
      securityAnswer,
      message,
      status: "pending"
    });
    res.status(201).json(newClaim);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;