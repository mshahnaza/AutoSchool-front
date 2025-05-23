import React from "react";
import { useNavigate } from "react-router-dom";

export default function TheoryExamTable({ title, address, exams }) {
  const navigate = useNavigate();

  return (
    <div className="exam-block">
      <h1 className="exam-title">{title}</h1>
      <h2 className="exam-address">{address}</h2>
      <table className="exam-table">
        <thead>
          <tr>
            <th>Дата экзамена</th>
            <th>Время</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((row, i) => (
            <tr
              key={i}
              className="exam-row"
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate("/exam", {
                  state: {
                    date: row.date,
                    title,
                    address,
                    type: "theory"
                  }
                })
              }
            >
              <td>{row.date}</td>
              <td>{row.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}