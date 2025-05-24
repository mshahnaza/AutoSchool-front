import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PracticeExamTable.css"; 

export default function PracticeExamTable({ title, address, phone, exams }) {
  const navigate = useNavigate();

  return (
    <div className="exam-block">
      <h1 className="exam-title">{title}</h1>
      <h2 className="exam-address">{address}</h2>
      {phone && (
        <div className="exam-phone">
          Телефон: <a href={`tel:${phone}`}>{phone}</a>
        </div>
      )}
      <table className="exam-table">
        <thead>
          <tr>
            <th>Дата экзамена</th>
            <th>Категория</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((row, i) => (
            <tr
              key={i}
              className="exam-row"
              onClick={() =>
                navigate("/exam", {
                  state: {
                    id: row.id,
                    originalDate: row.originalDate,
                    date: row.date,
                    title,
                    address,
                    category: row.category,
                    instructor: row.instructor, // передаем, но не показываем
                    type: "practice"
                  }
                })
              }
              style={{ cursor: "pointer" }}
            >
              <td>{row.date}</td>
              <td>{row.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}