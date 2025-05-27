import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ProfilePage.css";
import defaultAvatar from "../../assets/icons/default-avatar.svg";
import ExamsInfo from "./ExamsInfo";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      const email = localStorage.getItem("userEmail");
      if (!token || !email) return;

      try {
        const savedProfile = localStorage.getItem("userProfile");
        let localData = savedProfile ? JSON.parse(savedProfile) : null;

        const response = await axios.get("http://localhost:8888/api/v1/user/by-email", {
          params: { email },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let serverData = response.data;

        if (localData) {
          serverData = {
            ...serverData,
            about: localData.about ?? serverData.about,
            avatar: localData.avatar ?? serverData.avatar,
          };
        }

        setUserData(serverData);
        setTempData(serverData);
      } catch (err) {
        console.error("Ошибка при получении данных профиля", err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "about") {
      setTempData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setTempData((prev) => ({ ...prev, avatar: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedData = {
      avatar: tempData.avatar,
      about: tempData.about,
    };

    setUserData((prev) => ({
      ...prev,
      ...updatedData,
    }));

    setIsEditing(false);
    localStorage.setItem("userProfile", JSON.stringify(updatedData));
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("userId");
    localStorage.removeItem("studentId");
    navigate("/login");
  };

  if (!userData) return <div>Загрузка...</div>;

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
          <span>{userData.name}</span>
        </div>

        <div className="profile-field">
          <label>Email:</label>
          <span>{userData.email}</span>
        </div>

        <div className="profile-field">
          <label>Телефон:</label>
          <span>{userData.phone}</span>
        </div>

        <div className="profile-field">
          <label>Дата рождения:</label>
          <span>{userData.dateOfBirth ? userData.dateOfBirth.substring(0, 10) : "не указано"}</span>
        </div>

        <div className="profile-field">
          <label>О себе:</label>
          {isEditing ? (
            <textarea
              name="about"
              value={tempData.about || ""}
              onChange={handleChange}
            />
          ) : (
            <p className="about-text">{userData.about}</p>
          )}
        </div>

        <div className="button-group">
          {isEditing ? (
            <button className="save-btn" onClick={handleSave}>
              Сохранить
            </button>
          ) : (
            <button className="edit-btn" onClick={handleEdit}>
              Редактировать
            </button>
          )}

          <button className="logout-btn" onClick={handleLogout}>
            Выйти
          </button>
        </div>

        {userData.exams && <ExamsInfo exams={userData.exams} />}
      </div>
    </div>
  );
}
