const Claim = require("../models/claim");
const Item = require("../models/item");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

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

    let imageUrl = "";

    // 4️⃣ Upload image to Cloudinary (if file exists)
    if (req.file) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "quickfound_claims" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await streamUpload();
      imageUrl = result.secure_url;
    }

    // 5️⃣ Create claim with image
    const newClaim = await Claim.create({
      item: itemId,
      claimedBy: userId,
      answers,
      proofImage: imageUrl
    });

    res.status(201).json(newClaim);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};