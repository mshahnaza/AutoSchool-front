import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/InstructorGrade.css";
import Loader from "../shared/Loader";

const InstructorGrade = () => {
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState({});
  const [users, setUsers] = useState({});
  const [filterDate, setFilterDate] = useState("");
  const [gradingExam, setGradingExam] = useState(null);
  const [gradeValue, setGradeValue] = useState(1);
  const [remarks, setRemarks] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const instructorId = localStorage.getItem("instructorId");
  const token = localStorage.getItem("accessToken");

  //Получаем экзамены (только PENDING)
  const fetchExams = () => {
    if (!instructorId) {
        setLoading(false);
        return;
    }

    setLoading(true);

    let url = `http://localhost:8888/api/v1/exam/instructor-id/${instructorId}`;

    if (filterDate) {
      url += `/date/${filterDate}`;
    }

    axios
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const pendingExams = res.data.filter((exam) => exam.result === "PENDING");
        setExams(pendingExams);
      })
      .catch((err) => {
        console.error("Error fetching exams:", err);
        setExams([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchExams();
  }, [instructorId, token, filterDate]);

  //Для каждого экзамена получаем студента
  useEffect(() => {
    exams.forEach((exam) => {
      const studentId = exam.student?.id;
      if (studentId && !students[studentId]) {
        axios
          .get(`http://localhost:8888/api/v1/student/by-id/${studentId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setStudents((prev) => ({ ...prev, [studentId]: res.data }));
          })
          .catch(() => {
            console.error(`Failed to fetch student ${studentId}`);
          });
      }
    });
  }, [exams, students, token]);

  //Для каждого студента получаем пользователя (чтобы взять имя)
  useEffect(() => {
    Object.values(students).forEach((student) => {
      const userId = student.user?.id;
      if (userId && !users[userId]) {
        axios
          .get(`http://localhost:8888/api/v1/user/by-id/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setUsers((prev) => ({ ...prev, [userId]: res.data }));
          })
          .catch(() => {
            console.error(`Failed to fetch user ${userId}`);
          });
      }
    });
  }, [students, users, token]);

  //Оценить экзамен
  const handleGrade = async () => {
    if (!gradingExam) return;

    setLoading(true);

    try {
      await axios.patch(
        `http://localhost:8888/api/v1/exam/grade/${gradingExam.id}`,
        null, // тело PATCH запроса пустое
        {
            params: {
            result: gradeValue,
            remarks: remarks
            },
            headers: { Authorization: `Bearer ${token}` }
        }
        )
        .finally(() => {
            setLoading(false);
        });
      setMessage("Оценка сохранена!");
      setGradingExam(null);
      fetchExams(); // обновляем список
    } catch (err) {
      console.error(err);
      setMessage("Ошибка при оценивании.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="instructor-grade-container">
      <h2>Список экзаменов</h2>

      <div className="filter-section">
        <label>Фильтровать по дате:</label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        {filterDate && (
          <button className="reset-btn" onClick={() => setFilterDate("")}>
            Сбросить фильтр
          </button>
        )}
      </div>

      <table className="grade-exam-table">
        <thead>
          <tr>
            <th>Студент</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {exams.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                Нет экзаменов для оценки
              </td>
            </tr>
          )}
          {exams.map((exam) => {
            const studentId = exam.student?.id;
            const userId = students[studentId]?.user?.id;
            const studentName = users[userId] ? `${users[userId].name}` : "Загрузка...";
            // Форматируем дату (если нужно, например, только yyyy-mm-dd)
            const dateFormatted = exam.takenAt ? exam.takenAt.slice(0, 10) : "";

            return (
              <tr key={exam.id}>
                <td>{studentName}</td>
                <td>{dateFormatted}</td>
                <td>
                  <button onClick={() => setGradingExam(exam)}>Оценить</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {gradingExam && (
        <div className="modal-overlay" onClick={() => setGradingExam(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Оценить экзамен</h3>
            <p>
              Студент:{" "}
              {(() => {
                const studentId = gradingExam.student?.id;
                const userId = students[studentId]?.user?.id;
                return users[userId] ? `${users[userId].name}` : "Загрузка...";
              })()}
            </p>
            <p>Дата экзамена: {gradingExam.takenAt?.slice(0, 10)}</p>

            <label>Оценка (1-5):</label>
            <select
              value={gradeValue}
              onChange={(e) => setGradeValue(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>

            <label>Комментарии:</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Введите комментарий"
            />

            <button onClick={handleGrade}>Сохранить</button>
            <button
              className="cancel-btn"
              onClick={() => {
                setGradingExam(null);
                setMessage("");
                setRemarks("");
                setGradeValue(1);
              }}
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {message && (
        <p className={`message ${isError ? "error" : ""}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default InstructorGrade;
