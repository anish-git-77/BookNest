import React from "react";
import BookCard from "./BookCard.jsx";
import "./BookGrid.css";

export default function BookGrid({ books, loading, onBookClick }) {
  if (loading) {
    return (
      <div className="book-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="book-card-skeleton" key={i} />
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="book-grid-empty">
        <p>No books match that search. Try a different genre or title.</p>
      </div>
    );
  }

  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onClick={() => onBookClick(book)} />
      ))}
    </div>
  );
}
