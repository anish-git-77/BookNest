import React, { useEffect } from "react";
import "./BookModal.css";

export default function BookModal({ book, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="modal-cover" style={{ background: book.coverColor }} />

        <div className="modal-body">
          <p className="modal-genre">{book.genre}</p>
          <h2 id="modal-title">{book.title}</h2>
          <p className="modal-author">
            by {book.author} {book.year ? `· ${book.year}` : ""}
          </p>

          {book.rating && (
            <p className="modal-rating">★ {book.rating} / 5</p>
          )}

          <p className="modal-summary">{book.summary}</p>

          {book.availability?.length > 0 && (
            <div className="modal-availability">
              <span className="modal-availability-label">Where to find it</span>
              <div className="modal-availability-list">
                {book.availability.map((place) => (
                  <span key={place} className="modal-chip">
                    {place}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
