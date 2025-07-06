import React, { useState } from "react";
import axios from "axios";

const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:8888/api/v1/auth/login", formData);
    const { accessToken, refreshToken } = response.data.tokens;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("userEmail", formData.email); // сохраняем email

    const userRes = await axios.get("http://localhost:8888/api/v1/user/by-email", {
        params: { email: formData.email },
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const user = userRes.data;
      localStorage.setItem("role", user.role);

      if (user.role === "INSTRUCTOR") {
        const instrRes = await axios.get("http://localhost:8888/api/v1/instructor/by-user-id", {
          params: { userId: user.id },
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        window.location.href = "/instructor/add-slot";
        return;
      }

      if (user.role === "ADMIN") {
        window.location.href = "/admin";
        return;
      }

      onSuccess(accessToken);
    } catch (err) {
      setError("Неверные данные или ошибка сервера");
    }
};


  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2 className="auth-title">Вход</h2>
      <input
        className="auth-input"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
        value={formData.email}
      />
      <input
        className="auth-input"
        name="password"
        type="password"
        placeholder="Пароль"
        onChange={handleChange}
        required
        value={formData.password}
      />
      <button type="submit" className="auth-button">
        Войти
      </button>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </form>
  );
};

export default LoginForm;