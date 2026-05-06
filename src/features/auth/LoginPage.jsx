// src/features/auth/LoginPage.jsx
import { useState } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";
import { LoginApi } from "./authService";

export default function LoginPage() {
  const { handleLogin } = useAuth();
  const [email, setEmail] = useState("sohan1@gmail.com");
  const [password, setPassword] = useState("123456");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // await handleLogin(email, password);
      const data = await LoginApi(email, password)
      console.log(data)
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: 50 }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <input
        value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}