import api from "./api";

/**
 * Register a new user
 * @param {Object} userData
 * @returns {Promise<Object>}
 */
export const registerUser = async (userData) => {
  try {
    const payload = {
      name: userData.fullName || userData.name,
      email: userData.email,
      password: userData.password,
    };
    const response = await api.post("/auth/register", payload);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Registration failed",
      }
    );
  }
};

/**
 * Login user
 * @param {Object|String} emailOrUserData
 * @param {String} [password]
 * @returns {Promise<Object>}
 */
export const loginUser = async (emailOrUserData, password) => {
  try {
    const payload = typeof emailOrUserData === "object"
      ? emailOrUserData
      : { email: emailOrUserData, password };
    const response = await api.post("/auth/login", payload);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Login failed",
      }
    );
  }
};

/**
 * Get user profile info
 * @returns {Promise<Object>}
 */
export const getProfile = async () => {
  try {
    const response = await api.get("/auth/profile");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch profile",
      }
    );
  }
};

/**
 * Update user profile info
 * @param {Object} profileData
 * @returns {Promise<Object>}
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put("/auth/profile", profileData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to update profile",
      }
    );
  }
};

/**
 * Change user password
 * @param {Object} passwordData
 * @returns {Promise<Object>}
 */
export const changePassword = async (passwordData) => {
  try {
    const response = await api.put("/auth/change-password", passwordData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to change password",
      }
    );
  }
};
