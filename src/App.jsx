import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Tabs from "./components/Schedule/Tabs";
import Branches from "./components/branches/Branches";
import RoadAnimation from "./components/RoadAnimation";

function App() {
  return (
    <Router>
      <RoadAnimation />
      <Header />
      <Routes>
        <Route path="/schedule" element={<Tabs />} />
        <Route path="/branches" element={<Branches />} /> {/* добавили маршрут */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;