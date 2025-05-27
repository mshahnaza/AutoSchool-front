import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import Tabs from "./components/Schedule/Tabs";
import ProfilePage from "./components/profile/ProfilePage";
import Branches from "./components/branches/Branches";
import RoadAnimation from "./components/shared/RoadAnimation";
import ExamDetailPage from "./components/Schedule/ExamDetails"; 
import AuthPage from "./components/auth/AuthPage";
import axios from "axios";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
  const token = localStorage.getItem("accessToken");
  const email = localStorage.getItem("userEmail");
  setIsAuthenticated(!!token);

  if (token && email && !localStorage.getItem("userId")) {
    axios.get("http://localhost:8888/api/v1/user/by-email", {
      params: { email: localStorage.getItem("userEmail") },
      headers: { Authorization: `Bearer ${token}` }
    })

    .then(res => {
      if (res.data.id) {
        localStorage.setItem("userId", res.data.id);

        axios.get("http://localhost:8888/api/v1/student/by-user-id", {
          params: { userId: res.data.id },
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(studentRes => {
          if (studentRes.data.id) {
            localStorage.setItem("studentId", studentRes.data.id);
          }
        })
        .catch(err => {
          console.error("Не удалось получить studentId:", err.response?.data || err.message);
        });
      }
    })
    .catch((err) => {
      console.error("Failed to fetch user ID", err.response?.data || err.message);
    });
  }
}, [isAuthenticated]);



  return (
    <Router>
      {!isAuthenticated ? (
        <AuthPage setIsAuthenticated={setIsAuthenticated} />
      ) : (
        <>
          <RoadAnimation />
          <Header />
          <Routes>
            <Route path="/schedule" element={<Tabs />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/exam" element={<ExamDetailPage />} />
            <Route path="*" element={<Navigate to="/schedule" />} />
          </Routes>
          <Footer />
        </>
      )}
    </Router>
  );
}

export default App;
