import React, { useState, useEffect } from "react";
import ModalAlert from "../shared/ModalAlert";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ExamDetails.css";
import Loader from "../shared/Loader";

export default function ExamDetailPage() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    id, 
    date,
    originalDate, 
    title,
    address,
    category,
    instructor,
    type
  } = location.state || {};

  const [slots, setSlots] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertDetails, setAlertDetails] = useState({});

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios.get(`/api/v1/slot/exam-day-id/${id}`)
        .then(res => setSlots(res.data))
        .catch(() => setSlots([]))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleBook = async (slotId) => {
  try {
    setLoading(true);
    
    const studentId = 1;
    const examDate = originalDate;
    const takenAt = examDate;
    const expirationAt = new Date(examDate);
    expirationAt.setMonth(expirationAt.getMonth() + 3);
    const expirationAtStr = expirationAt.toISOString().slice(0, 10);

    const slot = slots.find(s => s.id === slotId);

    await axios.post("/api/v1/exam/create", {
      id: null,
      result: "PENDING",
      remarks: null,
      expirationAt: expirationAtStr,
      takenAt,
      studentId,
      slotId,
    });
    const res = await axios.get(`/api/v1/slot/exam-day-id/${id}`);
    setSlots(res.data);
    setAlertMsg("Вы успешно записались!");
    setAlertDetails(
      type === "practice"
        ? {
            date,
            time: slot?.time,
            category,
            instructor: slot?.instructor?.user?.name,
            address, // добавлено место
          }
        : {
            date,
            time: slot?.time,
            category,
            address, // добавлено место
          }
    );
    setAlertOpen(true);

  } catch (e) {
    setAlertMsg("Ошибка при бронировании слота");
    setAlertOpen(true);
    console.error("Ошибка при бронировании слота:", e?.response?.data || e);
  } finally {
    setLoading(false);
  }
};

  if (!date || !type) {
    return (
      <div className="exam-details-container">
        <p>Нет данных о выбранном экзамене.</p>
        <button className="back-btn" onClick={() => navigate(-1)}>Назад</button>
      </div>
    );
  }

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
            {type === "practice" && <th>Инструктор</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {slots.map((slot, index) => (
            <tr key={slot.id || index}>
              <td
                className="time-cell"
                onClick={() => {
                  if (type === "theory") setSelectedInstructor(slot.instructorName || "");
                  if (type === "practice") setSelectedInstructor(slot.instructor?.user?.name || "");
                }}
                style={{ cursor: "pointer" }}
              >
                {slot.time}
              </td>
              {type === "practice" && (
                <td>{slot.instructor?.user?.name || "-"}</td>
              )}
              <td>
                {slot.isBooked ? (
                  <button
                    className="signup-btn"
                    style={{ background: "#e53935", cursor: "not-allowed" }}
                    disabled
                  >
                    Занято
                  </button>
                ) : (
                  <button
                    className="signup-btn"
                    onClick={() => handleBook(slot.id)}
                  >
                    Записаться
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedInstructor && (
        <div style={{ marginTop: 16, fontWeight: 500 }}>
          Инструктор: {selectedInstructor}
        </div>
      )}

      <button className="back-btn" onClick={() => navigate(-1)}>
        Назад
      </button>
      {loading && <Loader />}
      <ModalAlert
        open={alertOpen}
        message={alertMsg}
        details={alertDetails}
        onClose={() => setAlertOpen(false)} />
    </div>
  );
}