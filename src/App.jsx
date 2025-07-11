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
import InstructorDashboard from "./components/instructor/InstructorSlots";
import BranchPage from "./components/admin/BranchPage";
import InstructorPage from "./components/admin/InstructorPage";
import axios from "axios";
import RegisterFormInstructor from "./components/auth/RegisterFormInstructor";
import InstructorSchedulePage from "./components/instructor/InstructorSchedulePage";
import InstructorGrade from "./components/instructor/InstructorGrade";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const email = localStorage.getItem("userEmail");
    setIsAuthenticated(!!token);
    setRole(localStorage.getItem("role"));

    if (token && email && !localStorage.getItem("userId")) {
      axios.get("http://localhost:8888/api/v1/user/by-email", {
        params: { email },
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
          axios.get("http://localhost:8888/api/v1/instructor/by-user-id", {
            params: { userId: res.data.id },
            headers: { Authorization: `Bearer ${token}` }
          })
          .then(instructorRes => {
            if (instructorRes.data.id) {
              localStorage.setItem("instructorId", instructorRes.data.id);
            }
          })
          .catch(err => {
            console.error("Не удалось получить instructorId:", err.response?.data || err.message);
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
      ) : role === "ADMIN" ? (
        <>
          <RoadAnimation />
          <Header admin={true} instructor={false}/>
          <Routes>
            <Route path="/admin/branches" element={<BranchPage />} />
            <Route path="/admin/instructors" element={<InstructorPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/admin/branches" />} />
          </Routes>
          <Footer />
        </>
      ) : role === "INSTRUCTOR" ? (
        <>
          <RoadAnimation />
          <Header admin={false} instructor={true}/>
          <Routes>
            <Route path="/instructor/add-slot" element={<InstructorDashboard />} />
            <Route path="/instructor/grade" element={<InstructorGrade />} />
            <Route path="/instructor/schedule" element={<InstructorSchedulePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/instructor" />} />
          </Routes>
          <Footer />
        </>
      ) : (
        <>
          <RoadAnimation />
          <Header admin={false} instructor={false}/>
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