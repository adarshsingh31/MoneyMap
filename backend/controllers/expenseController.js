const Expense = require("../models/Expense");

const addExpense = async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    const expense = await Expense.create({
      title,
      amount,
      category,
      user: req.user.id,
    });

    res.status(201).json({
      message: "Expense Added",
      expense,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user.id,
    });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addExpense,
  getExpenses,
};
