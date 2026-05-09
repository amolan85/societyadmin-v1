// src/features/auth/LoginPage.jsx

import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";
import { LoginApi } from "./authService";
import { useState, useLayoutEffect } from "react";
import { APP_CSS } from "../../components/Common/GlobalCss";

export default function LoginPage() {

  useLayoutEffect(() => {
    if (!document.getElementById("sv-css")) {
      const s = document.createElement("style");
      s.id = "sv-css";
      s.textContent = APP_CSS;
      document.head.appendChild(s);
    }
  }, []);

  const { handleLogin } = useAuth();

  const [email, setEmail] = useState("sohan1@gmail.com");
  const [password, setPassword] = useState("123456");

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await LoginApi(email, password);
      navigate("/dashboard");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="login-page">
      <div style={{ padding: 50 }}>
        <h2>Login</h2>

        <form onSubmit={onSubmit}>
          <input
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <br />
          <br />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <br />
          <br />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}