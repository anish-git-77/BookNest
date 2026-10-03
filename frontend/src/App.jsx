import React, { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import QuoteSearch from "./components/QuoteSearch.jsx";
import GenreFilter from "./components/GenreFilter.jsx";
import BookGrid from "./components/BookGrid.jsx";
import BookModal from "./components/BookModal.jsx";
import Footer from "./components/Footer.jsx";
import "./App.css";

export default function App() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [booksRes, genresRes] = await Promise.all([
          fetch("/api/books"),
          fetch("/api/genres"),
        ]);
        if (!booksRes.ok || !genresRes.ok) throw new Error("Request failed");
        const booksData = await booksRes.json();
        const genresData = await genresRes.json();
        setBooks(booksData.books);
        setGenres(genresData.genres);
        setError("");
      } catch (err) {
        console.error(err);
        setError(
          "Couldn't reach the BookNest backend. Make sure the backend server is running on port 5000."
        );
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const filteredBooks = useMemo(() => {
    let result = books;
    if (activeGenre !== "All") {
      result = result.filter((b) => b.genre === activeGenre);
    }
    if (searchTerm.trim()) {
      const needle = searchTerm.trim().toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(needle) ||
          b.author.toLowerCase().includes(needle)
      );
    }
    return result;
  }, [books, activeGenre, searchTerm]);

  return (
    <div className="app">
      <Navbar />
      <Hero bookCount={books.length} />
      <QuoteSearch onResultBookClick={setSelectedBook} />

      <section id="catalog" className="catalog">
        <div className="wrap">
          <div className="catalog-heading">
            <div>
              <h2>Browse the shelves</h2>
              <p className="catalog-sub">
                {loading
                  ? "Loading the catalog…"
                  : `${filteredBooks.length} of ${books.length} books`}
              </p>
            </div>
            <input
              className="catalog-search"
              type="text"
              placeholder="Search by title or author…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search by title or author"
            />
          </div>

          <GenreFilter
            genres={genres}
            activeGenre={activeGenre}
            onSelect={setActiveGenre}
          />

          {error && <p className="catalog-error">{error}</p>}

          {!error && (
            <BookGrid
              books={filteredBooks}
              loading={loading}
              onBookClick={setSelectedBook}
            />
          )}
        </div>
      </section>

      <Footer />

      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}
