import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ExamDetails.css";

// ...existing imports...
export default function ExamDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    date,
    title,
    address,
    category,
    instructor,
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

  return (
    <div className="exam-details-container">
      <h1>{title}</h1>
      <h2>{address}</h2>
      <h3>
        {date}
        {type === "practice" && category ? `, категория: ${category}` : ""}
        {type === "practice" && instructor ? `, инструктор: ${instructor}` : ""}
      </h3>

      <table className="exam-table">
        <thead>
          <tr>
            <th>Время</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((time, index) => (
            <tr key={index}>
              <td className="time-cell">{time}</td>
              <td>
                <button
                  className="signup-btn"
                  onClick={() =>
                    alert(
                      `Вы записались на ${date} в ${time}${
                        type === "practice" && category
                          ? ` (Категория: ${category})`
                          : ""
                      }${type === "practice" && instructor
                        ? `, инструктор: ${instructor}`
                        : ""}`
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