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
    
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    const {
      type, title, description, category,
      location, date, extraAttributes
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

    let parsedQuestions = [];
    if (req.body.securityQuestions) {
      try {
        parsedQuestions = typeof req.body.securityQuestions === "string"
          ? JSON.parse(req.body.securityQuestions)
          : req.body.securityQuestions;
      } catch (e) {
        parsedQuestions = [];
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
      securityQuestions: parsedQuestions, 
      extraAttributes:  parsedExtra,
      postedBy: req.user.id,  // from JWT — correct MongoDB _id
      status: "active"
    });

    res.status(201).json(item);
  } catch (err) {
    console.error("ERROR:", err);
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
    Claim item using MCQ answers
────────────────────────────────────────── */
router.post("/:id/claim", authMiddleware, async (req, res) => {
  try {
    const { answers } = req.body
    const itemId = req.params.id
    const userId = req.user.id

    const item = await Item.findById(itemId)
    if (!item) return res.status(404).json({ message: "Item not found" })

    if (item.status !== "active") {
      return res.status(400).json({ message: "Item already claimed" })
    }

    const questions = item.securityQuestions

    if (!Array.isArray(answers) || answers.length !== questions.length) {
      return res.status(400).json({ message: "Invalid answers format" })
    }

    let correctCount = 0
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correctCount++
    })

    const isVerified = correctCount >= Math.ceil(questions.length * 0.7)

    await Claim.create({
      item: itemId,
      claimedBy: userId,
      answers,
      status: isVerified ? "approved" : "rejected"
    })

    if (isVerified) {
      item.status = "claimed"
      await item.save()
    }

    res.json({
      success: true,
      verified: isVerified
    })

  } catch (err) {
    console.error("CLAIM ERROR:", err)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router;