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

  const [filterTime, setFilterTime] = useState("");
  const [filterInstructor, setFilterInstructor] = useState("");
  const [filterBooked, setFilterBooked] = useState("");

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
  const [allInstructors, setAllInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertDetails, setAlertDetails] = useState({});

  const token = localStorage.getItem("accessToken");
  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    if (type === "practice" && id) {
      axios.get(`/api/v1/slot/exam-day-id/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
        .then(res => {
          const instructors = [];
          res.data.forEach(slot => {
            if (slot.instructor && !instructors.find(i => i.id === slot.instructor.id)) {
              instructors.push(slot.instructor);
            }
          });
          setAllInstructors(instructors);
        });
    }
  }, [id, type, token]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    let url = "";
    let params = {};

    const timeStr = filterTime ? (filterTime.length === 5 ? filterTime + ":00" : filterTime) : null;
    const instructorId = filterInstructor ? filterInstructor : null;
    const isBooked = filterBooked !== "" ? filterBooked : null;

    // Все три фильтра
    if (instructorId && isBooked !== null && timeStr) {
      url = `/api/v1/slot/filter/examDay/${id}/instructor/${instructorId}/booked/${isBooked}/time`;
      params = { time: timeStr };
    }
    // Инструктор + статус
    else if (instructorId && isBooked !== null) {
      url = `/api/v1/slot/filter/examDay/${id}/instructor/${instructorId}/booked/${isBooked}`;
    }
    // Инструктор + время
    else if (instructorId && timeStr) {
      url = `/api/v1/slot/filter/examDay/${id}/instructor/${instructorId}/time`;
      params = { time: timeStr };
    }
    // Только инструктор
    else if (instructorId) {
      url = `/api/v1/slot/filter/examDay/${id}/instructor/${instructorId}`;
    }
    // Статус + время
    else if (isBooked !== null && timeStr) {
      url = `/api/v1/slot/filter/examDay/${id}/booked/${isBooked}/time`;
      params = { time: timeStr };
    }
    // Только статус
    else if (isBooked !== null) {
      url = `/api/v1/slot/filter/examDay/${id}/booked/${isBooked}`;
    }
    // Только время
    else if (timeStr) {
      url = `/api/v1/slot/filter/examDay/${id}/time`;
      params = { time: timeStr };
    }
    // Без фильтров
    else {
      url = `/api/v1/slot/exam-day-id/${id}`;
    }

    axios.get(url, {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => setSlots(res.data))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [id, filterTime, filterInstructor, filterBooked, token]);

  const handleBook = async (slotId) => {
    try {
      setLoading(true);
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
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      // Обновить список слотов после записи
      let url = `/api/v1/slot/exam-day-id/${id}`;
      let params = {};
      if (filterInstructor && filterBooked !== "" && filterTime) {
        url = `/api/v1/slot/filter/examDay/${id}/instructor/${filterInstructor}/booked/${filterBooked}/time`;
        params = { time: filterTime.length === 5 ? filterTime + ":00" : filterTime };
      } else if (filterInstructor && filterBooked !== "") {
        url = `/api/v1/slot/filter/examDay/${id}/instructor/${filterInstructor}/booked/${filterBooked}`;
      } else if (filterInstructor && filterTime) {
        url = `/api/v1/slot/filter/examDay/${id}/instructor/${filterInstructor}/time`;
        params = { time: filterTime.length === 5 ? filterTime + ":00" : filterTime };
      } else if (filterInstructor) {
        url = `/api/v1/slot/filter/examDay/${id}/instructor/${filterInstructor}`;
      } else if (filterBooked !== "" && filterTime) {
        url = `/api/v1/slot/filter/examDay/${id}/booked/${filterBooked}/time`;
        params = { time: filterTime.length === 5 ? filterTime + ":00" : filterTime };
      } else if (filterBooked !== "") {
        url = `/api/v1/slot/filter/examDay/${id}/booked/${filterBooked}`;
      } else if (filterTime) {
        url = `/api/v1/slot/filter/examDay/${id}/time`;
        params = { time: filterTime.length === 5 ? filterTime + ":00" : filterTime };
      }
      const res = await axios.get(url, {
        params,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setSlots(res.data);

      setAlertMsg("Вы успешно записались!");
      setAlertDetails(
        type === "practice"
          ? {
              date,
              time: slot?.time,
              category,
              instructor: slot?.instructor?.user?.name,
              address,
            }
          : {
              date,
              time: slot?.time,
              category,
              address,
            }
      );
      setAlertOpen(true);

    } catch (e) {
      const backendMsg =
        e?.response?.data?.message ||
        (typeof e?.response?.data === "string" ? e.response.data : null);

      setAlertMsg(backendMsg || "Ошибка при бронировании слота");
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

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, margin: "18px 0" }}>
        <label>
          Время:&nbsp;
          <input
            type="time"
            value={filterTime}
            onChange={e => setFilterTime(e.target.value)}
            style={{ fontSize: "1rem", padding: "4px 10px", borderRadius: 6, border: "1px solid #bdbdbd" }}
          />
        </label>
        {type === "practice" && (
          <label>
            Инструктор:&nbsp;
            <select
              value={filterInstructor}
              onChange={e => setFilterInstructor(e.target.value)}
              style={{ fontSize: "1rem", padding: "4px 10px", borderRadius: 6, border: "1px solid #bdbdbd" }}
            >
              <option value="">Все</option>
              {allInstructors.map(instr => (
                <option key={instr.id} value={instr.id}>
                  {instr.user?.name || "Без имени"}
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          Статус:&nbsp;
          <select
            value={filterBooked}
            onChange={e => setFilterBooked(e.target.value)}
            style={{ fontSize: "1rem", padding: "4px 10px", borderRadius: 6, border: "1px solid #bdbdbd" }}
          >
            <option value="">Все</option>
            <option value="false">Свободно</option>
            <option value="true">Занято</option>
          </select>
        </label>
        {(filterTime || filterInstructor || filterBooked !== "") && (
          <button
            className="filter-btn reset-btn"
            type="button"
            onClick={() => {
              setFilterTime("");
              setFilterInstructor("");
              setFilterBooked("");
            }}
            style={{ marginLeft: 0, marginTop: 8 }}
          >
            Сбросить фильтры
          </button>
        )}
      </div>

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