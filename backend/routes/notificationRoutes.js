const express = require("express");
const router = express.Router();
const Notification = require("../models/notification");
const authMiddleware = require("../middleware/authMiddleware");

/* ──────────────────────────────────────────
   GET /api/notifications
   Get all notifications for logged-in user
────────────────────────────────────────── */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ──────────────────────────────────────────
   PATCH /api/notifications/:id/read
   Mark notification as read
────────────────────────────────────────── */
router.patch("/:id/read", authMiddleware, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;