const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

app.get("/", (req, res) => {
  res.send("MoneyMap Backend Running");
});

const PORT = process.env.PORT || 5000;
app.use(express.json());
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
