require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.log("❌ DB Error:", err));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const claimRoutes = require("./routes/claimroutes");

app.use("/api/claims", claimRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/auth", authRoutes);
const authRoutes = require("./routes/authroutes");
const itemRoutes = require("./routes/itemroutes");