const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { createClaim } = require("../controllers/claimcontroller");

router.post("/", createClaim);
router.post("/create", upload.single("proofImage"), createClaim);

module.exports = router;
