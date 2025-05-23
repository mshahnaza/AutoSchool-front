import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ExamDetails.css";

export default function ExamDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    date,
    title,
    address,
    category,
    type // "theory" или "practice"
  } = location.state || {};

  if (!date || !type) {
    return (
      <div className="exam-details-container">
        <p>Нет данных о выбранном экзамене.</p>
        <button className="back-btn" onClick={() => navigate(-1)}>Назад</button>
      </div>
    );
  }

  const timeSlots = ["8:00", "10:00", "12:00"];
  const instructors = ["Иванов И.И.", "Петров П.П.", "Сидоров С.С."];

  return (
    <div className="exam-details-container">
      <h1>{title}</h1>
      <h2>{address}</h2>
      <h3>{date}</h3>
      {type === "practice" && <h4>Категория: {category}</h4>}

      <table className="exam-table">
        <thead>
          <tr>
            <th>Время</th>
            {type === "practice" && <th>Инструктор</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
            {timeSlots.map((time, index) => (
                <tr key={index}>
                <td className="time-cell">{time}</td>
                {type === "practice" && <td>{instructors[index % instructors.length]}</td>}
                <td>
                    <button
                    className="signup-btn"
                    onClick={() =>
                        alert(
                        `Вы записались на ${date} в ${time}${
                            type === "practice"
                            ? ` (Категория: ${category})`
                            : ""
                        }`
                        )
                    }
                    >
                    Записаться
                    </button>
                </td>
                </tr>
            ))}
        </tbody>
      </table>

      <button className="back-btn" onClick={() => navigate(-1)}>
        Назад
      </button>
    </div>
  );
}