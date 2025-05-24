import React from "react";
import "../styles/ModalAlert.css"; 

export default function ModalAlert({ open, message, onClose, details }) {
  if (!open) return null;
  return (
    <div className="modal-alert-backdrop">
      <div className="modal-alert">
        <div className="modal-alert-message">{message}</div>
        {details && (
          <div className="modal-alert-details">
            {details.date && <div>Дата: {details.date}</div>}
            {details.time && <div>Время: {details.time}</div>}
            {details.category && <div>Категория: {details.category}</div>}
            {details.instructor && <div>Инструктор: {details.instructor}</div>}
            {details.address && <div>Адрес: {details.address}</div>}
          </div>
        )}
        <button className="modal-alert-btn" onClick={onClose}>OK</button>
      </div>
    </div>
  );
}