import React, { useEffect, useState } from "react";
import "../styles/Branches.css";
import Loader from "../shared/Loader";

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8888/api/v1/branch/get-all")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка при загрузке филиалов");
        }
        return response.json();
      })
      .then((data) => {
        setBranches(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <Loader />
        <div style={{ marginTop: 18, fontSize: "1.1rem", color: "#1976d2", fontWeight: 500 }}>
        Загрузка...
        </div>
    </div>
    );
  if (error) return <p className="status-message error">Ошибка: {error}</p>;

  return (
    <div className="branches-container">
      <h1 className="page-title">Наши Филиалы</h1>
      <div className="branches-grid">
        {branches.map((branch) => (
          <div key={branch.id} className="branch-card">
            <h2 className="branch-title">{branch.name}</h2>
            <p className="branch-info">
              <strong>Адрес:</strong> {branch.address}
            </p>
            <p className="branch-info">
              <strong>Телефон:</strong>{" "}
              <a href={`tel:${branch.phone}`} className="phone-link">
                {branch.phone}
              </a>
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="map-link"
            >
              Посмотреть на карте
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Branches;