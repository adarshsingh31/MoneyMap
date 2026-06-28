const Expense = require("../models/Expense");

const addExpense = async (req, res) => {
  try {
    const { title, amount, category, type, date } = req.body;

    const expense = await Expense.create({
      title,
      amount,
      category,
      type,
      date: date || undefined,
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
const deleteExpense = async (req, res) => {
  try {
    console.log("DELETE REQUEST - Params ID:", req.params.id);
    console.log("DELETE REQUEST - User ID:", req.user?.id);

    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!expense) {
      console.log("DELETE FAILED - Expense not found or unauthorized");
      return res.status(404).json({
        message: "Expense not found or Unauthorized",
      });
    }

    console.log("DELETE SUCCESSFUL - Deleted expense:", expense._id);
    res.status(200).json({
      message: "Expense Deleted Successfully",
      expense,
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { title, amount, category, type, date } = req.body;

    const expense = await Expense.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        title,
        amount,
        category,
        type,
        date,
      },
      {
        new: true,
      },
    );

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found or Unauthorized",
      });
    }

    res.status(200).json({
      message: "Expense Updated Successfully",
      expense,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
};
