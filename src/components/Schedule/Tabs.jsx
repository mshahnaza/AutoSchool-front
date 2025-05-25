import React, { useEffect, useState } from "react";
import TheoryExamTable from "./TheoryExamTable";
import PracticeExamTable from "./PracticeExamTable";
import axios from "axios";
import "../styles/Tabs.css";
import Loader from "../shared/Loader";

export default function Tabs() {
  const [activeTab, setActiveTab] = useState("theory");
  const [allExams, setAllExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterDate, setFilterDate] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterBranch, setFilterBranch] = useState("");

  const [showFilter, setShowFilter] = useState(false);
  const [tempDate, setTempDate] = useState("");
  const [tempCategory, setTempCategory] = useState("");
  const [tempBranch, setTempBranch] = useState("");

  const resetFilters = () => {
    setFilterDate("");
    setFilterCategory("");
    setFilterBranch("");
  };

  const openFilter = () => {
    setTempDate(filterDate);
    setTempCategory(filterCategory);
    setTempBranch(filterBranch);
    setShowFilter(true);
  };

  const applyFilters = () => {
    setFilterDate(tempDate);
    setFilterCategory(tempCategory);
    setFilterBranch(tempBranch);
    setShowFilter(false);
  };

  const removeFilter = (type) => {
    if (type === "date") setFilterDate("");
    if (type === "category") setFilterCategory("");
    if (type === "branch") setFilterBranch("");
  };

  useEffect(() => {
  setLoading(true);

  let url = "/api/v1/exam-day/get-all";
  let params = {};

  if (filterDate && filterCategory) {
    url = "/api/v1/exam-day/filter-by-date-category";
    params = { date: filterDate, category: filterCategory, examType: "" };
  } else if (filterDate) {
    url = "/api/v1/exam-day/by-date";
    params = { date: filterDate };
  } else if (filterCategory) {
    url = "/api/v1/exam-day/by-category";
    params = { category: filterCategory };
  }

  axios.get(url, { params })
    .then(res => {
      setAllExams(res.data);
    })
    .catch(() => {
      setAllExams([]);
    })
    .finally(() => {
      setLoading(false);
    });
}, [filterDate, filterCategory, activeTab]);

  const theoryBlocks = [];
  const practiceBlocks = [];

  const groupByBranch = (exams) => {
    const map = {};
    exams.forEach(item => {
      const branchKey = item.branch.id;
      const branchInfo = {
        title: item.branch.name,
        address: item.branch.address,
        phone: item.branch.phone
      };
      const exam = {
        id: item.id,
        date: new Date(item.date).toLocaleDateString("ru-RU", { day: "2-digit", month: "long" }).toUpperCase(),
        originalDate: item.date,
        time: item.time || "",
        category: item.category,
        instructor: item.instructor || "",
        maxStudents: item.maxStudents,
        currentStudents: item.currentStudents
      };
      if (!map[branchKey]) {
        map[branchKey] = { ...branchInfo, exams: [] };
      }
      map[branchKey].exams.push(exam);
    });
    return Object.values(map);
  };

  const theory = allExams.filter(e => e.examType === "THEORETICAL");
  const practice = allExams.filter(e => e.examType === "PRACTICAL");

  const theoryGrouped = groupByBranch(theory);
  const practiceGrouped = groupByBranch(practice);

  const applyBranchFilter = (blocks) =>
    blocks
      .filter(block =>
        filterBranch
          ? block.title.toLowerCase().includes(filterBranch.toLowerCase())
          : true
      )
      .filter(block => block.exams.length > 0);

  if (loading) return <Loader />;

  return (
    <section>
      <div className="tabs">
        <button
          className={activeTab === "theory" ? "active" : ""}
          onClick={() => {
            setActiveTab("theory");
            resetFilters();
          }}
        >
          Теоретические экзамены
        </button>
        <button
          className={activeTab === "practice" ? "active" : ""}
          onClick={() => {
            setActiveTab("practice");
            resetFilters();
          }}
        >
          Практические экзамены
        </button>
      </div>

      <div className="filter-bar">
        <button className="filter-btn" onClick={openFilter}>
          <span style={{marginRight: 8}}>Фильтровать</span>
          <svg width="20" height="20" fill="#fff" viewBox="0 0 24 24"><path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 .8 1.6l-5.6 7.47V19a1 1 0 0 1-1.45.89l-4-2A1 1 0 0 1 9 17v-5.93L3.2 5.6A1 1 0 0 1 3 4zm3.14 2L10 10.78V17.38l2 1V10.78L17.86 6H6.14z"></path></svg>
        </button>
        { (filterDate || filterCategory || filterBranch) && (
          <div className="filter-chips">
            {filterDate && (
              <div className="filter-chip">
                <span>Дата: {filterDate}</span>
                <span className="chip-close" onClick={() => removeFilter("date")}>×</span>
              </div>
            )}
            {filterCategory && (
              <div className="filter-chip">
                <span>Категория: {filterCategory}</span>
                <span className="chip-close" onClick={() => removeFilter("category")}>×</span>
              </div>
            )}
            {filterBranch && (
              <div className="filter-chip">
                <span>Филиал: {filterBranch}</span>
                <span className="chip-close" onClick={() => removeFilter("branch")}>×</span>
              </div>
            )}
          </div>
        )}
      </div>

      {showFilter && (
        <div className="filter-modal-bg">
          <div className="filter-modal">
            <form
              onSubmit={e => {
                e.preventDefault();
                applyFilters();
              }}
            >
              <label>
                Дата:
                <input
                  type="date"
                  value={tempDate}
                  onChange={e => setTempDate(e.target.value)}
                />
              </label>
              {activeTab === "practice" && (
                <label>
                  Категория:
                  <input
                    type="text"
                    value={tempCategory}
                    onChange={e => setTempCategory(e.target.value)}
                    placeholder="например, B(на англ.)"
                  />
                </label>
              )}
              <label>
                Филиал:
                <input
                  type="text"
                  value={tempBranch}
                  onChange={e => setTempBranch(e.target.value)}
                  placeholder="Название филиала"
                />
              </label>
              <div className="filter-modal-actions">
                <button className="apply" type="submit">Применить</button>
                <button className="cancel" type="button" onClick={() => setShowFilter(false)}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div>
        {activeTab === "theory" && (
          applyBranchFilter(theoryGrouped).length === 0 ? (
            <div style={{ textAlign: "center", marginTop: 32, color: "#888" }}>
              По вашему запросу ничего не найдено
            </div>
          ) : (
            applyBranchFilter(theoryGrouped).map((block, idx) => (
              <TheoryExamTable
                key={idx}
                title={block.title}
                address={block.address}
                phone={block.phone}
                exams={block.exams}
              />
            ))
          )
        )}
        {activeTab === "practice" && (
          applyBranchFilter(practiceGrouped).length === 0 ? (
            <div style={{ textAlign: "center", marginTop: 32, color: "#888" }}>
              По вашему запросу ничего не найдено
            </div>
          ) : (
            applyBranchFilter(practiceGrouped).map((block, idx) => (
              <PracticeExamTable
                key={idx}
                title={block.title}
                address={block.address}
                phone={block.phone}
                exams={block.exams}
              />
            ))
          )
        )}
      </div>
    </section>
  );
}