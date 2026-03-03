const express = require("express");
const router = express.Router();
const { createClaim } = require("../controllers/claimcontroller");

router.post("/", createClaim);

module.exports = router;