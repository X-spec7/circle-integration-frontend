// Utility functions for token management

export const clearToken = () => {
  localStorage.removeItem("access_token");
  console.log("Token cleared manually");
};

export const triggerTokenExpiration = () => {
  console.log("Manually triggering token expiration");
  window.dispatchEvent(new CustomEvent("tokenExpired"));
};

// For development/testing purposes
export const simulateTokenExpiration = () => {
  clearToken();
  triggerTokenExpiration();
};
