import api from "./api";

/**
 * Budget Planning Service
 * 
 * Provides GET, POST, PUT, DELETE operations for budget planning.
 * Implements a robust localStorage fallback for local-only execution,
 * making it fully pluggable for backend API integration.
 */

// Local Storage Helpers
const getLocalBudgets = () => {
  try {
    const data = localStorage.getItem("moneyMap_budgets");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse budgets from localStorage", e);
    return [];
  }
};

const saveLocalBudgets = (budgets) => {
  localStorage.setItem("moneyMap_budgets", JSON.stringify(budgets));
};

/**
 * Get all budgets (or filter by user/month)
 */
export const getBudgets = async () => {
  try {
    // Attempt backend API call
    const response = await api.get("/budget");
    return response.data;
  } catch (error) {
    console.warn("Backend budget API not available, using localStorage fallback.");
    return getLocalBudgets();
  }
};

/**
 * Save / Create a new budget
 */
export const createBudget = async (budgetData) => {
  try {
    const response = await api.post("/budget", budgetData);
    return response.data;
  } catch (error) {
    console.warn("Backend budget API not available, using localStorage fallback.");
    const budgets = getLocalBudgets();
    const newBudget = {
      _id: `budget_${Date.now()}`,
      ...budgetData,
      createdAt: new Date().toISOString(),
    };
    budgets.push(newBudget);
    saveLocalBudgets(budgets);
    return newBudget;
  }
};

/**
 * Update an existing budget
 */
export const updateBudget = async (id, budgetData) => {
  try {
    const response = await api.put(`/budget/${id}`, budgetData);
    return response.data;
  } catch (error) {
    console.warn("Backend budget API not available, using localStorage fallback.");
    const budgets = getLocalBudgets();
    const index = budgets.findIndex((b) => b._id === id);
    if (index !== -1) {
      budgets[index] = { ...budgets[index], ...budgetData };
      saveLocalBudgets(budgets);
      return budgets[index];
    }
    throw new Error("Budget not found");
  }
};

/**
 * Delete a budget
 */
export const deleteBudget = async (id) => {
  try {
    const response = await api.delete(`/budget/${id}`);
    return response.data;
  } catch (error) {
    console.warn("Backend budget API not available, using localStorage fallback.");
    let budgets = getLocalBudgets();
    budgets = budgets.filter((b) => b._id !== id);
    saveLocalBudgets(budgets);
    return { success: true, message: "Budget deleted successfully" };
  }
};
