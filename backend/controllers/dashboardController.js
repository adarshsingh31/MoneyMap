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

module.exports = {
  getSummary,
};
