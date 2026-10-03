import React from "react";
import "./BookCard.css";

function initials(title) {
  return title
    .split(" ")
    .filter((w) => w.length > 2 || w === w.toUpperCase())
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function BookCard({ book, onClick }) {
  return (
    <button className="book-card" onClick={onClick} style={{ "--spine": book.coverColor }}>
      <div className="book-card-cover" style={{ background: book.coverColor }}>
        <span className="book-card-initials">{initials(book.title)}</span>
      </div>
      <div className="book-card-body">
        <p className="book-card-genre">{book.genre}</p>
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">{book.author}</p>
        <div className="book-card-rating" aria-label={`Rated ${book.rating} out of 5`}>
          ★ {book.rating}
          <span className="book-card-year">· {book.year}</span>
        </div>
      </div>
    </button>
  );
}
