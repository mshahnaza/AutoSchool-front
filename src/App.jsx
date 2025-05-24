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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, []);

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
