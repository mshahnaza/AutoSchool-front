import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterFormStudent from "./RegisterFormStudent";
import RegisterFormInstructor from "./RegisterFormInstructor";
import "../styles/Auth.css";

const AuthPage = ({ setIsAuthenticated }) => {
  // режимы: login, registerTypeSelection, student, instructor
  const [mode, setMode] = useState("login");

  return (
    <div className="auth-container">
      <div className="auth-card">
        {mode === "login" && (
          <>
            <LoginForm onSuccess={() => setIsAuthenticated(true)} />
            <button className="role-button" onClick={() => setMode("registerTypeSelection")}>
              Регистрация
            </button>
          </>
        )}

        {mode === "registerTypeSelection" && (
          <>
            <h2 style={{ textAlign: "center", marginBottom: "24px", color: "#1e3a8a" }}>
              Регистрация
            </h2>
            <button className="role-button" onClick={() => setMode("student")}>
              Я студент
            </button>
            <button className="role-button" onClick={() => setMode("instructor")}>
              Я инструктор
            </button>
            <button
              className="auth-button back-button"
              style={{ marginTop: "30px" }}
              onClick={() => setMode("login")}
            >
              Назад
            </button>
          </>
        )}

        {mode === "student" && (
          <RegisterFormStudent
            onSuccess={() => setIsAuthenticated(true)}
            onBack={() => setMode("registerTypeSelection")}
          />
        )}

        {mode === "instructor" && (
          <RegisterFormInstructor
            onSuccess={() => setIsAuthenticated(true)}
            onBack={() => setMode("registerTypeSelection")}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
