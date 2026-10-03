import React from "react";
import "./GenreFilter.css";

export default function GenreFilter({ genres, activeGenre, onSelect }) {
  const all = ["All", ...genres];

  return (
    <div className="genre-filter" role="group" aria-label="Filter by genre">
      {all.map((g) => (
        <button
          key={g}
          className={`pill ${activeGenre === g ? "active" : ""}`}
          onClick={() => onSelect(g)}
          aria-pressed={activeGenre === g}
        >
          {g}
        </button>
      ))}
    </div>
  );
}
