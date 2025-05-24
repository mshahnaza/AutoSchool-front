import React from "react";

const RegisterTypeSelector = ({ onSelect, onBack }) => (
  <div>
    <h2>Регистрация</h2>
    <button onClick={() => onSelect("student")}>Регистрация студента</button>
    <button onClick={() => onSelect("instructor")}>Регистрация инструктора</button>
    <button onClick={onBack}>Назад</button>
  </div>
);

export default RegisterTypeSelector;