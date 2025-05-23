import React from "react";
import "./styles/ExamsInfo.css";

export default function ExamsInfo({ exams }) {
  const { theory, practice } = exams;

  const theoryPassed = theory.score >= 18;
  const practicePassed = practice.passed && theoryPassed;

  return (
    <div className="exams-container">
      <h2>Информация об экзаменах</h2>

      <div className="exam-item">
        <h3>Теория</h3>
        <p>
          Статус:{" "}
          <span className={theoryPassed ? "passed" : "failed"}>
            {theoryPassed ? "Сдан" : "Не сдан"}
          </span>
        </p>
        <p>
          Балл: {theory.score} из {theory.maxScore}
        </p>
        <p>Дата сдачи: {theory.date || "—"}</p>
      </div>

      <div className="exam-item">
        <h3>Практика</h3>
        {theoryPassed ? (
          <>
            <p>
              Статус:{" "}
              <span className={practicePassed ? "passed" : "failed"}>
                {practicePassed ? "Сдан" : "Не сдан"}
              </span>
            </p>
            <p>Дата сдачи: {practice.date || "—"}</p>
          </>
        ) : (
          <p className="info">
            Практический экзамен можно сдавать после успешной сдачи теории.
          </p>
        )}
      </div>
    </div>
  );
}
