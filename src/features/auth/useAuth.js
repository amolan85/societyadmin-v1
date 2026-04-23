// src/features/auth/useAuth.js
import { useState } from "react";
import * as authService from "./authService";

export default function useAuth() {
  const [user, setUser] = useState(authService.getUser());

  const handleLogin = async (email, password) => {
    const user = await authService.login(email, password);
    setUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  return { user, handleLogin, handleLogout };
}