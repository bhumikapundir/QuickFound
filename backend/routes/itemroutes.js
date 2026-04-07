const express = require("express");
const router = express.Router();
const Item = require("../models/item");
const Claim = require("../models/claim");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const upload = require("../middleware/upload");
const Notification = require("../models/notification");
const User = require("../models/user");

// POST claim — replace the existing "/:id/claim" handler
router.post("/:id/claim", async (req, res) => {
  const { answers, message } = req.body;
  const userId = req.headers["x-user-id"];

  try {
    const item = await Item.findById(req.params.id).populate("postedBy", "name studentId");
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.status !== "active") return res.status(400).json({ message: "Item already claimed" });

    const questions = item.securityQuestions || [];

    // If no security questions, auto-approve
    if (questions.length === 0) {
      item.status = "claimed";
      await item.save();
      return res.status(201).json({ success: true, verified: true, message: "Claim approved" });
    }

    const parsedAnswers = Array.isArray(answers) ? answers : [];

    if (parsedAnswers.length !== questions.length) {
      return res.status(400).json({ message: "Please answer all questions" });
    }

    let correctCount = 0;
    questions.forEach((q, i) => {
      if (parsedAnswers[i] === q.correctAnswer) correctCount++;
    });

    const isVerified = correctCount >= Math.ceil(questions.length * 0.7);

    if (isVerified) {
      item.status = "claimed";
      await item.save();

      // Get claimer details
      const claimer = await User.findById(userId);

      if (claimer) {
        // Create notification for the item poster
        await Notification.create({
          user: item.postedBy._id,
          message: `${claimer.name} successfully claimed your item "${item.title}"`,
          type: "claim_success",
          isRead: false,
          data: {
            claimerName: claimer.name,
            claimerId: claimer.studentId,
            contact: claimer.email || claimer.studentId,
            itemTitle: item.title
          }
        });
      }
    }

    res.status(201).json({
      success: true,
      verified: isVerified,
      score: `${correctCount}/${questions.length}`,
      message: isVerified
        ? "Claim approved! Item marked as claimed."
        : "Incorrect answers. Claim rejected."
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
    const {
      type, title, description, category,
      location, date, securityQuestions, extraAttributes
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
      type,
      status: "active",
      category,
      description,
      location,
      date,
      imageUrl,
      securityQuestions: securityQuestions ? JSON.parse(securityQuestions) : [],
      extraAttributes: extraAttributes ? JSON.parse(extraAttributes) : {},
      postedBy: req.headers["x-user-id"]
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

// POST claim — replace the existing "/:id/claim" handler
router.post("/:id/claim", async (req, res) => {
  const { answers, message } = req.body;
  const userId = req.headers["x-user-id"];

  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.status !== "active") return res.status(400).json({ message: "Item already claimed" });

    const questions = item.securityQuestions || [];

    // If no security questions, auto-approve
    if (questions.length === 0) {
      item.status = "claimed";
      await item.save();
      return res.status(201).json({ success: true, verified: true, message: "Claim approved" });
    }

    const parsedAnswers = Array.isArray(answers) ? answers : [];

    if (parsedAnswers.length !== questions.length) {
      return res.status(400).json({ message: "Please answer all questions" });
    }

    let correctCount = 0;
    questions.forEach((q, i) => {
      if (parsedAnswers[i] === q.correctAnswer) correctCount++;
    });

    const isVerified = correctCount >= Math.ceil(questions.length * 0.7);

    if (isVerified) {
      item.status = "claimed";
      await item.save();
    }

    res.status(201).json({
      success: true,
      verified: isVerified,
      score: `${correctCount}/${questions.length}`,
      message: isVerified ? "Claim approved! Item marked as claimed." : "Incorrect answers. Claim rejected."
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;