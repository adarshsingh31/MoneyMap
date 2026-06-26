// Authentication service simulator for MoneyMap

/**
 * Simulates a network request to authenticate a user.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<object>} Authenticated user data and token
 */
export const loginUser = async (email, password) => {
  // Simulate network delay (1.5 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Basic mock authentication check
  if (email === "test@example.com" && password === "password123") {
    return {
      success: true,
      user: {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        username: "testuser",
      },
      token: "mock-jwt-token-12345",
    };
  }

  throw new Error("Invalid email or password. Hint: use test@example.com / password123");
};

/**
 * Simulates a network request to register a new user.
 * @param {object} userData - User details including fullName, email, password
 * @returns {Promise<object>} Registered user data and token
 */
export const registerUser = async (userData) => {
  // Simulate network delay (1.5 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Basic mock validation/success check
  if (userData.email === "existing@example.com") {
    throw new Error("Email address is already registered.");
  }

  return {
    success: true,
    user: {
      id: "2",
      name: userData.fullName,
      email: userData.email,
    },
    token: "mock-jwt-token-67890",
  };
};
