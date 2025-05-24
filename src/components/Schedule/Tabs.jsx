import React, { useEffect, useState } from "react";
import TheoryExamTable from "./TheoryExamTable";
import PracticeExamTable from "./PracticeExamTable";
import axios from "axios";
import "../styles/Tabs.css";

export default function Tabs() {
  const [activeTab, setActiveTab] = useState("theory");
  const [theoryBlocks, setTheoryBlocks] = useState([]);
  const [practiceBlocks, setPracticeBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/v1/exam-day/get-all").then(res => {
      const data = res.data;
      console.log("API response:", res.data);

      // Группируем по филиалам и типу экзамена
      const theoryMap = {};
      const practiceMap = {};

      data.forEach(item => {
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
          time: item.time || "", // если появится поле time
          category: item.category,
          instructor: item.instructor || "",
          maxStudents: item.maxStudents,
          currentStudents: item.currentStudents
        };

        if (item.examType === "THEORETICAL") {
          if (!theoryMap[branchKey]) {
            theoryMap[branchKey] = { ...branchInfo, exams: [] };
          }
          theoryMap[branchKey].exams.push(exam);
        } else if (item.examType === "PRACTICAL") {
          if (!practiceMap[branchKey]) {
            practiceMap[branchKey] = { ...branchInfo, exams: [] };
          }
          practiceMap[branchKey].exams.push(exam);
        }
      });

      setTheoryBlocks(Object.values(theoryMap));
      setPracticeBlocks(Object.values(practiceMap));
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <section>
      <div className="tabs">
        <button
          className={activeTab === "theory" ? "active" : ""}
          onClick={() => setActiveTab("theory")}
        >
          Теоретические экзамены
        </button>
        <button
          className={activeTab === "practice" ? "active" : ""}
          onClick={() => setActiveTab("practice")}
        >
          Практические экзамены
        </button>
      </div>
      <div>
        {activeTab === "theory" &&
          theoryBlocks.map((block, idx) => (
            <TheoryExamTable
              key={idx}
              title={block.title}
              address={block.address}
              phone={block.phone}
              exams={block.exams}
            />
          ))}
        {activeTab === "practice" &&
          practiceBlocks.map((block, idx) => (
            <PracticeExamTable
              key={idx}
              title={block.title}
              address={block.address}
              phone={block.phone}
              exams={block.exams}
            />
          ))}
      </div>
    </section>
  );
}