const Expense = require("../models/Expense");

const getSummary = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });

    let totalIncome = 0;
    let totalExpense = 0;

    for (const expense of expenses) {
      if (expense.type === "income") {
        totalIncome += expense.amount;
      } else {
        totalExpense += expense.amount;
      }
    }

    const balance = totalIncome - totalExpense;

    res.status(200).json({
      totalIncome,
      totalExpense,
      balance,
      transactionCount: expenses.length,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getRecentTransactions = async (req, res) => {
  try {
    const transactions = await Expense.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(5);
    res.status(200).json({
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getCategorySummary = async (req, res) => {
  try {
    const transactions = await Expense.find({
      user: req.user.id,
      type: "expense", // Only expenses
    });

    const categorySummary = {};

    for (const transaction of transactions) {
      if (categorySummary[transaction.category]) {
        categorySummary[transaction.category] += transaction.amount;
      } else {
        categorySummary[transaction.category] = transaction.amount;
      }
    }

    res.status(200).json({
      categorySummary,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getMonthlySummary = async (req, res) => {
  try {
    const transactions = await Expense.find({
      user: req.user.id,
      type: "expense",
    }).sort({ date: 1 });

    const monthlySummary = {};

    for (const transaction of transactions) {
      const month = transaction.date.toLocaleString("default", {
        month: "long",
      });

      if (monthlySummary[month]) {
        monthlySummary[month] += transaction.amount;
      } else {
        monthlySummary[month] = transaction.amount;
      }
    }

    res.status(200).json({
      monthlySummary,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  getSummary,
  getRecentTransactions,
  getCategorySummary,
  getMonthlySummary
};
