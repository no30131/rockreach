import React from "react";
import { Link } from "react-router-dom";
import "./stylesheets/Footer.css";
import { DEMO_MODE } from "../utils/demo";

const Footer = () => {
  return (
    <footer>
      {DEMO_MODE && (
        <div className="footer-demo-notice">
          🎮 Demo 模式｜靜態假資料．地圖使用 OpenStreetMap 取代 Google Maps
        </div>
      )}
      <div className="footer-main">
        <div className="footer-rights">
          <p>© {new Date().getFullYear()} RockReach. All rights reserved.</p>
        </div>
        <div className="footer-links">
          <Link to="/service" className="button">服務條款</Link>
          <Link to="/policy" className="button">隱私權政策</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
