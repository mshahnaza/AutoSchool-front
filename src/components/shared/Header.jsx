import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Header.css";
import logoIcon from "../../assets/icons/logoo.svg";
import profileIcon from "../../assets/icons/profile-icon.svg";
import ProfileModal from "../ProfilePage";

export default function Header() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header__logo">
          <NavLink to="/">
            <img src={logoIcon} alt="Логотип" height={36} />
          </NavLink>
        </div>
        <nav className="header__nav">
          <NavLink
            to="/schedule"
            className={({ isActive }) => (isActive ? "nav-menu active" : "nav-menu")}
          >
            Расписание
          </NavLink>
          <NavLink
            to="/branches"
            className={({ isActive }) => (isActive ? "nav-menu active" : "nav-menu")}
          >
            Филиалы
          </NavLink>
          <div className="profile-icon">
            <NavLink to="/profile" className="profileIcon">
              <img src={profileIcon} alt="Профиль" height={36} />
            </NavLink>
          </div>
        </nav>
      </header>
    </>
  );
}
