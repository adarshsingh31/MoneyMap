const express = require("express");
const router = express.Router();
const {
  getSummary,
  getRecentTransactions,
  getCategorySummary,
  getMonthlySummary,
} = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");

router.get("/summary", protect, getSummary);
router.get("/recent", protect, getRecentTransactions);
router.get("/category", protect, getCategorySummary);
router.get("/monthly", protect, getMonthlySummary);
module.exports = router;
