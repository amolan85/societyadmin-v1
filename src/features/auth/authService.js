// src/features/auth/authService.js

export const login = async (email, password) => {
  // FAKE LOGIN (replace with API)
  if (email === "admin@test.com" && password === "123456") {
    const user = { email };
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } else {
    throw new Error("Invalid credentials");
  }
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};