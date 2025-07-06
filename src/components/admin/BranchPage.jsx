import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/BranchPage.css";
import Loader from "../shared/Loader";

const BranchAdminPage = () => {
  const [branches, setBranches] = useState([]);
  const [branchForm, setBranchForm] = useState({ id: "", name: "", address: "", phone: "" });
  const [editingBranchId, setEditingBranchId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken");

  const fetchBranches = () => {
    setLoading(true);
    axios
      .get("http://localhost:8888/api/v1/branch/get-all", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setBranches(res.data))
      .catch(() => setBranches([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleBranchSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const url = editingBranchId
      ? "http://localhost:8888/api/v1/branch/update"
      : "http://localhost:8888/api/v1/branch/create";
    axios[editingBranchId ? "put" : "post"](url, branchForm, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setBranchForm({ id: "", name: "", address: "", phone: "" });
        setEditingBranchId(null);
        fetchBranches();
      })
      .catch(() => setError("Ошибка при сохранении филиала"))
      .finally(() => setLoading(false));
  };

  const handleEditBranch = (branch) => {
    setBranchForm(branch);
    setEditingBranchId(branch.id);
  };

    if (loading) return <Loader />;

  return (
    <div className="branch-dashboard">
      <h1>Управление филиалами</h1>
      <section className="branch-section">
        <h2>Филиалы</h2>
        <form className="branch-form" onSubmit={handleBranchSubmit}>
          <input
            className="branch-input"
            type="text"
            placeholder="Название"
            value={branchForm.name}
            onChange={e => setBranchForm({ ...branchForm, name: e.target.value })}
            required
          />
          <input
            className="branch-input"
            type="text"
            placeholder="Адрес"
            value={branchForm.address}
            onChange={e => setBranchForm({ ...branchForm, address: e.target.value })}
            required
          />
          <input
            className="branch-input"
            type="text"
            placeholder="Телефон"
            value={branchForm.phone}
            onChange={e => setBranchForm({ ...branchForm, phone: e.target.value })}
            required
          />
          <div className="branch-form-buttons">
            <button type="submit" className="branch-btn">
              {editingBranchId ? "Сохранить" : "Добавить филиал"}
            </button>
            {editingBranchId && (
              <button
                type="button"
                className="branch-btn branch-btn-cancel"
                onClick={() => {
                  setBranchForm({ id: "", name: "", address: "", phone: "" });
                  setEditingBranchId(null);
                }}
              >
                Отмена
              </button>
            )}
          </div>
        </form>
        <ul className="branch-list">
          {branches.map(branch => (
            <li key={branch.id} className="branch-list-item">
              <span>
                <b>{branch.name}</b> — {branch.address} — {branch.phone}
              </span>
              <span>
                <button className="branch-btn branch-btn-edit" onClick={() => handleEditBranch(branch)}>
                  Изменить
                </button>
              </span>
            </li>
          ))}
        </ul>
      </section>
      {error && <p className="branch-error">{error}</p>}
    </div>
  );
};

export default BranchAdminPage;