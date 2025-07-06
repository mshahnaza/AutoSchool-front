import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/InstructorSlots.css";

const InstructorDashboard = () => {
  const [practicalExamDays, setPracticalExamDays] = useState([]);
  const [newSlot, setNewSlot] = useState({ examDayId: "", time: "", maxStudentNumber: 1 });
  const instructorId = localStorage.getItem("instructorId");
  const token = localStorage.getItem("accessToken");

  // Получаем все ExamDay с типом PRACTICAL
  useEffect(() => {
    axios
      .get("http://localhost:8888/api/v1/exam-day/get-all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Фильтруем только практические дни
        const practicalDays = res.data.filter(day => day.examType === "PRACTICAL");
        setPracticalExamDays(practicalDays);
      })
      .catch(() => alert("Ошибка при получении дней экзаменов"));
  }, [token]);

  const handleCreateSlot = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:8888/api/v1/slot/create",
        {
          ...newSlot,
          instructorId: Number(instructorId),
          isBooked: false,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert("Слот успешно создан!");
        setNewSlot({ examDayId: "", time: "", maxStudentNumber: 1 });
      })
      .catch(() => alert("Ошибка при создании слота"));
  };

  return (
    <section className="instructor-dashboard">
      <h2>Создать слот</h2>
      <form onSubmit={handleCreateSlot}>
        <label>
          Выберите дату экзамена:
          <select
            value={newSlot.examDayId}
            onChange={(e) =>
              setNewSlot({ ...newSlot, examDayId: e.target.value })
            }
            required
          >
            <option value="">-- Выберите дату --</option>
            {practicalExamDays.map((day) => (
              <option key={day.id} value={day.id}>
                {day.date} ({day.category})
              </option>
            ))}
          </select>
        </label>

        <input
          type="time"
          value={newSlot.time}
          onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
          required
        />

        <input
          type="number"
          min={1}
          value={newSlot.maxStudentNumber}
          onChange={(e) =>
            setNewSlot({
              ...newSlot,
              maxStudentNumber: Number(e.target.value),
            })
          }
          required
        />

        <button type="submit">Создать слот</button>
      </form>
    </section>
  );
};

export default InstructorDashboard;
