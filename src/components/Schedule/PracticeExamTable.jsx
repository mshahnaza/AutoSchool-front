import { useNavigate } from "react-router-dom";
import "../styles/PracticeExamTable.css"; 

export default function PracticeExamTable({ title, address, exams }) {
  const navigate = useNavigate();

  return (
    <div className="exam-block">
      <h1 className="exam-title">{title}</h1>
      <h2 className="exam-address">{address}</h2>
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
                    date: row.date,
                    title,
                    address,
                    category: row.category,
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
