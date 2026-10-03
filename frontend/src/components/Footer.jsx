import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer id="about" className="footer">
      <div className="wrap footer-inner">
        <div>
          <p className="footer-logo">📖 BookNest</p>
          <p className="footer-tagline">
            A small library for people who remember lines better than titles.
          </p>
        </div>
        <p className="footer-note">
          Built with React, Vite, Express, and Gemini. Book data is for demo
          purposes.
        </p>
      </div>
    </footer>
  );
}
