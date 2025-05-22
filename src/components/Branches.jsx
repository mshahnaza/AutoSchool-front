import React from "react";
import "./styles/Branches.css";

const branches = [
  {
    name: "Филиал в Сокулукском районе",
    address: "г. Бишкек, Штраф стоянка при ГАИ",
    phone: "+996 (312) 123-456",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d768.8097752687064!2d74.33674123741785!3d42.862848633675824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x389eda751696b4d7%3A0x9b7f1b4fc101ba71!2sShtraf%20Stoyanka%20Pri%20Gai!5e0!3m2!1sen!2skg!4v1747936022141!5m2!1sen!2skg",
    link: "https://maps.app.goo.gl/3wVwic4yanxu2XSA8",
  },
  {
  name: "Филиал в Бишкеке",
  address: "г. Бишкек, ул. Тыналиева 27",
  phone: "+996 (312) 765-43-21",
  mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2923.9175074354894!2d74.5671835761359!3d42.87458527114967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x389ec9001ceeecf3%3A0x1ce91a1fa2e2f9a0!2z0JPQvtGB0YPQtNCw0YDRgdGC0LLQtdC90L3QvtC1INCw0LPQtdC90YLRgdGC0LLQviDQv9C-INGA0LXQs9C40YHRgtGA0LDRhtC40Lgg0YLRgNCw0L3RgdC_0L7RgNGC0L3Ri9GFINGB0YDQtdC00YHRgtCy!5e0!3m2!1sru!2skg!4v1747937469869!5m2!1sru!2skg",
  link: "https://maps.app.goo.gl/fiw9iYaYuN8TrNSK7"
}
];

const Branches = () => {
  return (
    <div className="branches-container">
      <div className="branches-grid">
        {branches.map((branch, index) => (
          <div key={index} className="branch-card">
            <h2 className="branch-title">{branch.name}</h2>
            <p>
              <strong>Адрес:</strong> {branch.address}
            </p>
            <p>
              <strong>Телефон:</strong> {branch.phone}
            </p>
            <div className="branch-map">
              <iframe
                src={branch.mapSrc}
                width="100%"
                height="300"
                frameBorder="0"
                allowFullScreen
                title={`Карта ${branch.name}`}
              ></iframe>
            </div>
            <a
              href={branch.link}
              target="_blank"
              rel="noopener noreferrer"
              className="branch-link"
            >
              Перейти по этому адресу
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Branches;