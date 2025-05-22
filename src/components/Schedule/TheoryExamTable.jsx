import React from "react";
import "../styles/TheoryExamTable.css";

export default function TheoryExamTable({ title, address, exams }) {
  return (
    <div className="exam-block">
      <h1 className="exam-title">{title}</h1>
      <h2 className="exam-address">{address}</h2>
      <table className="exam-table">
        <thead>
          <tr>
            <th>Дата экзамена</th>
            <th>Время экзамена</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((row, i) => (
            <tr key={i}>
              <td>{row.date}</td>
              <td>{row.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}