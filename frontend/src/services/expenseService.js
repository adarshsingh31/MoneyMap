import api from "./api";

/**
 * Add a new transaction
 * @param {Object} data - { title, amount, category, type, date }
 * @returns {Promise<Object>}
 */
export const addExpense = async (data) => {
  try {
    const response = await api.post("/expenses", data);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to add transaction",
      }
    );
  }
};

/**
 * Get all transactions
 * @returns {Promise<Array>}
 */
export const getExpenses = async () => {
  try {
    const response = await api.get("/expenses");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch transactions",
      }
    );
  }
};

/**
 * Update an existing transaction
 * @param {String} id
 * @param {Object} data - { title, amount, category, type, date }
 * @returns {Promise<Object>}
 */
export const updateExpense = async (id, data) => {
  try {
    const response = await api.put(`/expenses/${id}`, data);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to update transaction",
      }
    );
  }
};

/**
 * Delete a transaction
 * @param {String} id
 * @returns {Promise<Object>}
 */
export const deleteExpense = async (id) => {
  try {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to delete transaction",
      }
    );
  }
};

/**
 * Get dashboard summary metrics
 * @returns {Promise<Object>}
 */
export const getDashboardSummary = async () => {
  try {
    const response = await api.get("/dashboard/summary");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch dashboard summary",
      }
    );
  }
};

/**
 * Get recent transactions
 * @returns {Promise<Object>}
 */
export const getRecentTransactions = async () => {
  try {
    const response = await api.get("/dashboard/recent");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch recent transactions",
      }
    );
  }
};

/**
 * Get category distribution data
 * @returns {Promise<Object>}
 */
export const getCategorySummary = async () => {
  try {
    const response = await api.get("/dashboard/category");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch category summary",
      }
    );
  }
};

/**
 * Get monthly trend summary data
 * @returns {Promise<Object>}
 */
export const getMonthlySummary = async () => {
  try {
    const response = await api.get("/dashboard/monthly");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch monthly summary",
      }
    );
  }
};
