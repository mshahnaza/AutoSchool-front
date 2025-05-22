import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Tabs from "./components/Schedule/Tabs";
import RoadAnimation from "./components/RoadAnimation";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/schedule" element={<Tabs />} />
        {/* Add other routes here */}
      </Routes>
      <RoadAnimation />
      <Footer />
    </Router>
  );
}

export default App;