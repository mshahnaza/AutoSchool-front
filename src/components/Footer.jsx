import React from "react";

export default function Footer() {
  return (
    <footer style={{ textAlign: "center", margin: "40px 0 10px", color: "#888" }}>
      © {new Date().getFullYear()} АвтоГид. Создано Super Girls.
    </footer>
  );
}