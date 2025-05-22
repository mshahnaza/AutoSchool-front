import React from "react";
import "./styles/Header.css";
import logoIcon from "../assets/icons/logo.svg";
import profileIcon from "../assets/icons/profile-icon.svg";

export default function Header() {
  return (
    <header className="header">
      <div className="header__logo">
        <a href="/">
          <img src={logoIcon} alt="Логотип" height={36} />
        </a>
      </div>
      <nav className="header__nav">
        <a href="/schedule" className="nav-menu">Расписание</a>
        <a href="/adresa-filialov" className="nav-menu">Филиалы</a>
        <div className="profile-icon">
        <a className="profileIcon" href="/profile">
          <img src={profileIcon} alt="Профиль" height={36} />
        </a>
      </div>
      </nav>
    </header>
  );
}