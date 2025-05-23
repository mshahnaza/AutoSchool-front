import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Tabs from "./components/Schedule/Tabs";
import Branches from "./components/branches/Branches";
import RoadAnimation from "./components/RoadAnimation";
import ExamDetailPage from "./components/Schedule/ExamDetails"; 

function App() {
  return (
    <Router>
      <RoadAnimation />
      <Header />
      <Routes>
        <Route path="/schedule" element={<Tabs />} />
        <Route path="/branches" element={<Branches />} /> {/* добавили маршрут */}
        <Route path="/exam" element={<ExamDetailPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;