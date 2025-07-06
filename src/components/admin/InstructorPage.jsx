import React, { useState } from "react";
import "../styles/InstructorPage.css";
import axios from "axios";

const InstructorAdminPage = ({ onSuccess, onBack }) => {
  const [formData, setFormData] = useState({
    licenseNumber: "",
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
        "http://localhost:8888/api/v1/auth/register-instructor",
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
    <div className="instructor-dashboard">
      <h1>Регистрация инструктора</h1>
      <section className="instructor-section">
        <form className="instructor-form" onSubmit={handleSubmit}>
          <input
            className="instructor-input"
            name="licenseNumber"
            type="text"
            placeholder="Номер лицензии"
            value={formData.licenseNumber}
            onChange={ handleChange }
            required
          />
          <input
            className="instructor-input"
            name="name"
            type="text"
            placeholder="Имя"
            value={formData.user.name}
            onChange={ handleChange}
            required
          />
          <input
            className="instructor-input"
            name="email"
            type="email"
            placeholder="Email"
            value={formData.user.email}
            onChange={ handleChange}
            required
          />
          <input
            className="instructor-input"
            name="password"
            type="password"
            placeholder="Пароль"
            value={formData.user.password}
            onChange={ handleChange}
            required
          />
          <input
            className="instructor-input"
            name="phone"
            type="text"
            placeholder="Телефон"
            value={formData.user.phone}
            onChange={ handleChange}
            required
          />
          <input
            className="instructor-input"
            name="dateOfBirth"
            type="date"
            placeholder="Дата рождения"
            value={formData.user.dateOfBirth}
            onChange={ handleChange }
            required
          />
          <button type="submit" className="instructor-btn">Зарегистрировать инструктора</button>
        </form>
      </section>
      {error && <p className="instructor-error">{error}</p>}
    </div>
  );
};

export default InstructorAdminPage;