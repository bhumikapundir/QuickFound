const Claim = require("../models/claim");
const Item = require("../models/item");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

exports.createClaim = async (req, res) => {
  try {
    const { itemId, answers } = req.body;
    const userId = req.user.id; // (assuming you have JWT middleware)

   let parsedAnswers = [];
   try {
      parsedAnswers = typeof answers === "string" ? JSON.parse(answers) : answers;
    } catch(e) {
      parsedAnswers = [];
    }
  
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.status !== "active") return res.status(400).json({ message: "Item already claimed" });
    if (!item.securityQuestions || item.securityQuestions.length === 0) {
      return res.status(400).json({ message: "No security questions for this item" });
    }

    const questions = item.securityQuestions;
    // answers should be like: [0, 2, 1]
    if (!Array.isArray(parsedAnswers) || parsedAnswers.length !== questions.length) {
      return res.status(400).json({ message: "Invalid answers format" });
    }

    if (parsedAnswers.some(a => typeof a !== "number")) {
      return res.status(400).json({ message: "Answers must be indexes" });
    }
    for (let i = 0; i < parsedAnswers.length; i++) {
      if (parsedAnswers[i] < 0 || parsedAnswers[i] >= questions[i].options.length) {
        return res.status(400).json({ message: "Answer index out of range" });
      }
    }

    // compare answers
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (parsedAnswers[index] === q.correctAnswer) {
        correctCount++;
      }
    });

    const isVerified = correctCount >= Math.ceil(questions.length * 0.7);

    const existingClaim = await Claim.findOne({ item: itemId, claimedBy: userId });
    if (existingClaim) return res.status(400).json({ message: "You already claimed this item" });

    let imageUrl = "";
    if (req.file) {
      const streamUpload = () => new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "quickfound_claims" },
          (error, result) => result ? resolve(result) : reject(error)
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      const result = await streamUpload();
      imageUrl = result.secure_url;
    }

    const newClaim = await Claim.create({
      item: itemId,
      claimedBy: userId,
      answers: parsedAnswers,
      proofImage: imageUrl,
      status: isVerified ? "approved" : "rejected"
    });

    if (isVerified) {
      const updated = await Item.findOneAndUpdate(
        { _id: itemId, status: "active" },
        { status: "claimed" }
      );

      if (!updated) {
        return res.status(400).json({ message: "Item already claimed" });
      }
    }

    res.status(201).json({
      success: true,
      verified: isVerified,
      score: `${correctCount}/${questions.length}`,
      message: isVerified ? "Claim approved" : "Claim rejected"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};