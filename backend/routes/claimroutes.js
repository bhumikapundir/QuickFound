const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { createClaim } = require("../controllers/claimcontroller");
const Claim = require("../models/claim");
const User = require("../models/user");

router.post("/", createClaim);
router.post("/create", upload.single("proofImage"), createClaim);

/* OWNER NOTIFICATION - see claims for items posted by this owner */
router.get("/owner/:studentId", async (req, res) => {
  try {

    const claims = await Claim.find({ ownerId: req.params.studentId });

    const detailed = await Promise.all(
      claims.map(async (claim) => {

        const user = await User.findOne({ studentId: claim.claimerId });

        return {
          claimId: claim._id,
          itemId: claim.itemId,
          claimerName: user?.name,
          claimerId: user?.studentId,
          status: claim.status,
          createdAt: claim.createdAt
        };

      })
    );

    res.json(detailed);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;