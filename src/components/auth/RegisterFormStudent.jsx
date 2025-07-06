import React, { useState } from "react";
import axios from "axios";

const RegisterFormStudent = ({ onSuccess, onBack }) => {
  const [formData, setFormData] = useState({
    passportId: "",
    user: {
      name: "",
      email: "",
      password: "",
      phone: "",
      dateOfBirth: "",
    },
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.user) {
      setFormData({ ...formData, user: { ...formData.user, [name]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:8888/api/v1/auth/register-student",
        formData
      );
      const { accessToken, refreshToken } = response.data;
      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        onSuccess();
      }
    } catch (error) {
      setError(error.response?.data || "Ошибка регистрации");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Регистрация студента</h2>
      <input
        className="auth-input"
        name="name"
        placeholder="Имя"
        onChange={handleChange}
        required
        value={formData.user.name}
      />
      <input
        className="auth-input"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
        value={formData.user.email}
      />
      <input
        className="auth-input"
        name="password"
        type="password"
        placeholder="Пароль"
        onChange={handleChange}
        required
        value={formData.user.password}
      />
      <input
        className="auth-input"
        name="phone"
        placeholder="Телефон"
        onChange={handleChange}
        value={formData.user.phone}
      />
      <input
        className="auth-input"
        name="dateOfBirth"
        type="date"
        onChange={handleChange}
        required
        value={formData.user.dateOfBirth}
      />
      <input
        className="auth-input"
        name="passportId"
        placeholder="Паспорт ID"
        onChange={handleChange}
        required
        value={formData.passportId}
      />
      <button className="auth-button" type="submit" onClick={onSuccess}>
        Зарегистрироваться
      </button>
      <button
        type="button"
        className="auth-button"
        style={{ marginTop: "8px", backgroundColor: "#6b7280" }}
        onClick={onBack}
      >
        Назад
      </button>
      {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}
    </form>
  );
};

export default RegisterFormStudent;
