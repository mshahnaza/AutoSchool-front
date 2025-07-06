import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/InstructorSchedule.css";
import Loader from "../shared/Loader";

const InstructorSchedulePage = () => {
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState({});
  const [users, setUsers] = useState({}); 
  const [filterResult, setFilterResult] = useState("");
  const [filterDate, setFilterDate] = useState("");
  
  const [tempResult, setTempResult] = useState("");
  const [tempDate, setTempDate] = useState("");

  const [showFilter, setShowFilter] = useState(false);

  const [loading, setLoading] = useState(true);

  const instructorId = localStorage.getItem("instructorId");
  const token = localStorage.getItem("accessToken");

  // Получаем экзамены
  const fetchExams = () => {
    if (!instructorId) {
        setLoading(false);
        return;
    }

    setLoading(true);

    let url = `http://localhost:8888/api/v1/exam/instructor-id/${instructorId}`;

    if (filterResult) {
        url = url + `/result/${filterResult}`;
    }
    if (filterDate) {
        url = url + `/date/${filterDate}`;
    }

    axios
      .get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setExams(res.data);
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
  }, [instructorId, token, filterResult, filterDate]);

  const openFilter = () => {
    setTempResult(filterResult);
    setTempDate(filterDate);
    setShowFilter(true);
  };

  const applyFilters = () => {
    if (tempResult && tempDate) {
        alert("Можно фильтровать только по одному параметру: дата или результат");
        return;
    }
    setFilterResult(tempResult);
    setFilterDate(tempDate);
    setShowFilter(false);
  };

  const removeFilter = (type) => {
    if (type === "result") setFilterResult("");
    if (type === "date") setFilterDate("");
  };

  const resetFilters = () => {
    setFilterResult("");
    setFilterDate("");
  }

  // Для каждого экзамена получаем студента, если его еще нет в students
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

  // Для каждого студента получаем пользователя, если еще нет в users
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

  if (loading) return <Loader />;

  return (
    <section className="schedule-table">
      <h2 className="exam-title">Exam schedule</h2>

      <div className="filter-bar">
        <button className="filter-btn" onClick={openFilter}>
            <span style={{marginRight: 8}}>Фильтровать</span>
          <svg width="20" height="20" fill="#fff" viewBox="0 0 24 24"><path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 .8 1.6l-5.6 7.47V19a1 1 0 0 1-1.45.89l-4-2A1 1 0 0 1 9 17v-5.93L3.2 5.6A1 1 0 0 1 3 4zm3.14 2L10 10.78V17.38l2 1V10.78L17.86 6H6.14z"></path></svg>
        </button>
      </div>

      {(filterDate || filterResult) && (
        <div className="filter-chips">
            {filterDate && (
                <div className="filter-chip">
                    <span>Дата: {filterDate}</span>
                    <span className="chip-close" onClick={() => removeFilter("date")}>×</span>
                </div>
            )}
            {filterResult && (
                <div className="filter-chip">
                    <span>Результат: {filterResult}</span>
                    <span className="chip-close" onClick={() => removeFilter("result")}>×</span>
                </div>
            )}
        </div>
      )}

      {showFilter && (
        <div className="filter-modal-bg">
          <div className="filter-modal">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    applyFilters();
                }}
            >
                <label>
                    Дата:
                    <input
                        type="date"
                        value={tempDate}
                        onChange={(e) => {
                            setTempDate(e.target.value);
                            if (e.target.value) setTempResult("")
                        }}
                    />
                </label>
                <label>
                    Результат:
                    <input
                        type="text"
                        value={tempResult}
                        placeholder="PENDING/FAILED/PASSED"
                        onChange={(e) => {
                            setTempResult(e.target.value);
                            if (e.target.value) setTempDate("")
                        }}
                    />
                </label>
                <div className="filter-modal-actions">
                    <button className="apply" type="submit" >Применить</button>
                    <button className="cancel" type="button" onClick={() => setShowFilter(false)}>Отмена</button>
                </div>
            </form>
          </div>
        </div>
      )}

      {exams.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: 32, color: "#888" }}>
              По вашему запросу ничего не найдено
            </div>
        ) : (
          <table className="exam-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Exam Date</th>
                <th>Result</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => {
                const studentId = exam.student?.id;
                const student = students[studentId];
                const userId = student?.user?.id;
                const user = users[userId];

                return (
                  <tr key={exam.id}>
                    <td>{user?.name || "-"}</td>
                    <td>{exam.takenAt || "-"}</td>
                    <td>{exam.result || "-"}</td>
                    <td>{exam.remarks || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
      )}
    </section>
  );
};

export default InstructorSchedulePage;
