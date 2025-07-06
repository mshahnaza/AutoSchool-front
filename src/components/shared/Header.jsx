import React from "react";
import { NavLink } from "react-router-dom";
import logoIcon from "../../assets/icons/logoo.svg";
import profileIcon from "../../assets/icons/profile-icon.svg";
import "../styles/Header.css";

export default function Header({ admin, instructor }) {
  return (
    <header className="header">
      <div className="header__logo">
        <NavLink to={admin ? "/admin" : instructor ? "/instructor" : "/"}>
          <img src={logoIcon} alt="Логотип" height={36} />
        </NavLink>
      </div>
      <nav className="header__nav">
      {admin ? (
        <>
          <NavLink
            to="/admin/instructors"
            className={({ isActive }) => (isActive ? "nav-menu active" : "nav-menu")}
          >
            Добавить инструктора
          </NavLink>
          <NavLink
            to="/admin/branches"
            className={({ isActive }) => (isActive ? "nav-menu active" : "nav-menu")}
          >
            Филиалы
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "nav-menu active" : "nav-menu")}
          >
            <img src={profileIcon} alt="Профиль" height={28} style={{ verticalAlign: "middle" }} />
          </NavLink>
        </>
      ) : instructor ? (
        <>
          <NavLink
            to="/instructor/add-slot"
            className={({ isActive }) => (isActive ? "nav-menu active" : "nav-menu")}
          >
            Слоты
          </NavLink>
          <NavLink
            to="/instructor/schedule"
            className={({ isActive }) => (isActive ? "nav-menu active" : "nav-menu")}
          >
            Расписание
          </NavLink>
          <NavLink
            to="/instructor/grade" 
            className={({ isActive }) => (isActive ? "nav-menu active" : "nav-menu")}
          >
            Оценить
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "nav-menu active" : "nav-menu")}
          >
            <img src={profileIcon} alt="Профиль" height={28} style={{ verticalAlign: "middle" }} />
          </NavLink>
        </>
      ) : (
        <>
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
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "nav-menu active" : "nav-menu")}
          >
            <img src={profileIcon} alt="Профиль" height={28} style={{ verticalAlign: "middle" }} />
          </NavLink>
        </>
      )}
      </nav>
    </header>
  );
}