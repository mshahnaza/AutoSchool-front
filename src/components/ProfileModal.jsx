import React from "react";
import "./styles/ProfileModal.css";

export default function ProfileModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Вход / Регистрация</h2>
        <form className="modal-form">
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Пароль" required />
          <button type="submit">Войти</button>
        </form>
        <p className="switch-text">
          Нет аккаунта? <a href="#">Зарегистрироваться</a>
        </p>
      </div>
    </div>
  );
}