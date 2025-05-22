import React, { useState } from "react";
import TheoryExamTable from "./TheoryExamTable";
import PracticeExamTable from "./PracticeExamTable";
import "../styles/Tabs.css";

const examData = {
  theory: [
    {
      title: "Какое-то место",
      address: "Какой-то адрес",
      exams: [
        { date: "21 МАЯ", time: "8:00" },
        { date: "23 МАЯ", time: "8:00" },
        { date: "28 МАЯ", time: "8:00" },
        { date: "30 МАЯ", time: "8:00" }
      ]
    }
  ],
  practice: [
    {
      title: "АЮ Grand",
      address: "ул. Чокана Валиханова, 2а",
      exams: [
        { date: "22 МАЯ", category: "A" },
        { date: "24 МАЯ", category: "B" }
      ]
    }
  ]
};

export default function Tabs() {
  const [activeTab, setActiveTab] = useState("theory");

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
          examData.theory.map((block, idx) => (
            <TheoryExamTable
              key={idx}
              title={block.title}
              address={block.address}
              exams={block.exams}
            />
          ))}
        {activeTab === "practice" &&
          examData.practice.map((block, idx) => (
            <PracticeExamTable
              key={idx}
              title={block.title}
              address={block.address}
              exams={block.exams}
            />
          ))}
      </div>
    </section>
  );
}