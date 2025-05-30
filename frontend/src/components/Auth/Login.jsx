import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  try {
    const res = await loginUser({ email, password });
    console.log("Login response:", res);
    login(res.user, res.token);
    // localStorage.setItem("token", res.token);
    navigate("/dashboard");
  } catch (err) {
    setError(err.message || "Login failed");
  }
};


  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        className="border p-2 mb-3 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 mb-3 w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button className="bg-blue-600 text-white p-2 w-full">Login</button>
    </form>
  );
}
