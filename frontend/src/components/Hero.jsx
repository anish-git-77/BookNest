import React from "react";
import "./Hero.css";

const SPINES = [
  { color: "#b8863f", h: 78 },
  { color: "#7a2331", h: 96 },
  { color: "#3d5a80", h: 66 },
  { color: "#40531b", h: 88 },
  { color: "#5e548e", h: 72 },
  { color: "#9d0208", h: 84 },
  { color: "#d9b579", h: 60 },
  { color: "#264653", h: 92 },
];

export default function Hero({ bookCount }) {
  return (
    <section id="top" className="hero">
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <p className="hero-eyebrow">A quieter kind of book search</p>
          <h1>
            Find the book
            <br />
            you half-remember.
          </h1>
          <p className="hero-sub">
            Browse {bookCount || "dozens of"} titles across every genre, or
            type a single line you can't shake — we'll do the rest.
          </p>
          <div className="hero-actions">
            <a className="btn btn-on-dark" href="#quote-search">
              Search by a line
            </a>
            <a className="btn btn-ghost-dark" href="#catalog">
              Browse the shelves
            </a>
          </div>
        </div>

        <div className="hero-shelf" aria-hidden="true">
          {SPINES.map((s, i) => (
            <span
              key={i}
              className="hero-spine"
              style={{ background: s.color, height: `${s.h}%` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
