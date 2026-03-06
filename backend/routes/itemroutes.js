const express = require("express");
const router = express.Router();
const Item = require("../models/item");
const Claim = require("../models/claim");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

/* ──────────────────────────────────────────
   GET /api/items
   Returns all items (optionally filtered)
────────────────────────────────────────── */
router.get("/", async (req, res) => {
  try {
    const { type, status, category, search } = req.query;

    const filter = {};
    if (type && type !== "all")     filter.type = type;
    if (status && status !== "all") filter.status = status;
    if (category && category !== "all") filter.category = category;
    if (search) {
      filter.$or = [
        { title:       { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location:    { $regex: search, $options: "i" } },
      ];
    }

    const items = await Item.find(filter)
      .populate("postedBy", "name studentId email")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ──────────────────────────────────────────
   GET /api/items/mine
   Returns items posted by the logged-in user
────────────────────────────────────────── */
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const items = await Item.find({ postedBy: req.user.id })
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ──────────────────────────────────────────
   GET /api/items/:id
   Returns a single item by ID
────────────────────────────────────────── */
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("postedBy", "name studentId email");
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ──────────────────────────────────────────
   POST /api/items
   Create a new lost/found item
   Requires auth. Accepts multipart/form-data
────────────────────────────────────────── */
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const {
      type, title, description, category,
      location, date, securityQuestion, securityAnswer, extraAttributes
    } = req.body;

    // Upload image to Cloudinary if provided
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

    // Parse extraAttributes if sent as JSON string
    let parsedExtra = {};
    if (extraAttributes) {
      try {
        parsedExtra = typeof extraAttributes === "string"
          ? JSON.parse(extraAttributes)
          : extraAttributes;
      } catch {
        parsedExtra = {};
      }
    }

    const item = await Item.create({
      type,
      title,
      description,
      category: category || "other",
      location,
      date,
      imageUrl,
      securityQuestion: securityQuestion || "",
      securityAnswer:   securityAnswer   || "",
      extraAttributes:  parsedExtra,
      postedBy: req.user.id,  // from JWT — correct MongoDB _id
      status: "active"
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ──────────────────────────────────────────
   DELETE /api/items/:id
   Delete an item (only by the owner)
────────────────────────────────────────── */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (String(item.postedBy) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not authorised to delete this item" });
    }

    await item.deleteOne();
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ──────────────────────────────────────────
   POST /api/items/claim  (legacy route)
────────────────────────────────────────── */
router.post("/claim", async (req, res) => {
  const { itemId, studentId } = req.body;

  try {
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (String(item.postedBy) === String(studentId)) {
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
      securityQuestions: item.securityQuestion ? [item.securityQuestion] : []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;