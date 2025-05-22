import React from 'react';
// import './Schedule.css';

const scheduleData = [
  {
    date: 'Понедельник, 27 мая',
    items: ['09:00 — Теоретический экзамен', '11:00 — Практический экзамен']
  },
  {
    date: 'Вторник, 28 мая',
    items: ['10:00 — Теоретический экзамен', '12:00 — Практический экзамен']
  },
  // Добавь другие дни по необходимости
];

const Schedule = () => {
  return (
    <div className="schedule-container">
      <h1 className="schedule-title">Расписание занятий</h1>
      {scheduleData.map((day, idx) => (
        <div key={idx} className="schedule-day">
          <h2>{day.date}</h2>
          <ul>
            {day.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Schedule;
