import React, { useState } from "react";
import "./styles/ProfilePage.css";
import defaultAvatar from "../assets/icons/default-avatar.svg";
import ExamsInfo from "./ExamsInfo"; // импортируем новый компонент

export default function ProfilePage() {
  const [userData, setUserData] = useState(() => ({
    name: "Иван Иванов",
    email: "ivan@example.com",
    phone: "+7 (999) 123-45-67",
    passportId: "1234 567890",
    about: "Преподаватель математики с 5-летним стажем.",
    avatar: localStorage.getItem("userAvatar") || null,
    exams: {
      theory: { score: 19, maxScore: 20, date: "2025-05-10" },
      practice: { passed: true, date: "2025-05-15" },
    },
  }));

  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(userData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setTempData((prev) => ({ ...prev, avatar: base64 }));
        localStorage.setItem("userAvatar", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setTempData(userData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserData(tempData);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Профиль пользователя</h1>

        <div className="avatar-section">
          <img
            src={tempData.avatar || defaultAvatar}
            alt="Аватар"
            className="avatar-image"
          />
          {isEditing && (
            <label className="upload-btn">
              Загрузить фото
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                hidden
              />
            </label>
          )}
        </div>

        <div className="profile-field">
          <label>Имя:</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={tempData.name}
              onChange={handleChange}
            />
          ) : (
            <span>{userData.name}</span>
          )}
        </div>

        <div className="profile-field">
          <label>Email:</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={tempData.email}
              onChange={handleChange}
            />
          ) : (
            <span>{userData.email}</span>
          )}
        </div>

        <div className="profile-field">
          <label>Номер телефона:</label>
          {isEditing ? (
            <input
              type="text"
              name="phone"
              value={tempData.phone}
              onChange={handleChange}
            />
          ) : (
            <span>{userData.phone}</span>
          )}
        </div>

        <div className="profile-field">
          <label>Паспорт ID:</label>
          {isEditing ? (
            <input
              type="text"
              name="passportId"
              value={tempData.passportId}
              onChange={handleChange}
            />
          ) : (
            <span>{userData.passportId}</span>
          )}
        </div>

        <div className="profile-field">
          <label>О себе:</label>
          {isEditing ? (
            <textarea
              name="about"
              rows="4"
              value={tempData.about}
              onChange={handleChange}
            />
          ) : (
            <p className="about-text">{userData.about}</p>
          )}
        </div>

        {isEditing ? (
          <button className="save-btn" onClick={handleSave}>
            Сохранить
          </button>
        ) : (
          <button className="edit-btn" onClick={handleEdit}>
            Редактировать
          </button>
        )}

        {/* Вставляем компонент экзаменов */}
        <ExamsInfo exams={userData.exams} />
      </div>
    </div>
  );
}
