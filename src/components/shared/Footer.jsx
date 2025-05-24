import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Footer.css";
import youtubeIcon from "../../assets/icons/youtube.svg";
import vkIcon from "../../assets/icons/vk.svg";
import telegramIcon from "../../assets/icons/telegram.svg";
import tiktokIcon from "../../assets/icons/tiktok.svg";
import logoIcon from "../../assets/icons/logoo.svg";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Логотип и соцсети */}
        <div className="footer-left">
          <img src={logoIcon} alt="АвтоГид" className="logo" />
          <div className="social-icons">
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <img src={youtubeIcon} alt="YouTube" />
            </a>
            <a href="https://vk.com" target="_blank" rel="noopener noreferrer">
              <img src={vkIcon} alt="VK" />
            </a>
            <a href="https://t.me" target="_blank" rel="noopener noreferrer">
              <img src={telegramIcon} alt="Telegram" />
            </a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
              <img src={tiktokIcon} alt="TikTok" />
            </a>
          </div>
        </div>

        {/* Колонки */}
        <div className="footer-columns">
          <div className="footer-column">
            <h4>ОБУЧЕНИЕ</h4>
            <a href="#">Автошколы</a>
            <a href="#">Онлайн-материалы</a>
          </div>
          <div className="footer-column">
            <h4>О НАС</h4>
            <a href="#">Филиалы</a>
            <a href="#">Контакты</a>
          </div>
          <div className="footer-column">
            <h4>ИНФОРМАЦИЯ</h4>
            <a href="#">Политика конфиденциальности</a>
          <NavLink to="/schedule">Расписание</NavLink>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} АвтоГид. Создано командой Super Girls.
      </div>
    </footer>
  );
}
