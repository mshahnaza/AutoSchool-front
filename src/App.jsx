import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Tabs from "./components/Schedule/Tabs";
import Branches from "./components/Branches";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/schedule" element={<Tabs />} />
        {/* Add other routes here */}
      </Routes>
      <Routes>
        <Route path="/schedule" element={<Tabs />} />
        <Route path="/branches" element={<Branches />} /> {/* добавили маршрут */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;