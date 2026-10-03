import React, { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a className="nav-logo" href="#top">
          <span className="nav-logo-mark">📖</span> BookNest
        </a>

        <nav className={`nav-links ${open ? "is-open" : ""}`}>
          <a href="#catalog" onClick={() => setOpen(false)}>
            Browse
          </a>
          <a href="#quote-search" onClick={() => setOpen(false)}>
            Find by a line
          </a>
          <a href="#about" onClick={() => setOpen(false)}>
            About
          </a>
        </nav>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
