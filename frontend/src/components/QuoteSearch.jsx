import React, { useState } from "react";
import "./QuoteSearch.css";

const EXAMPLES = [
  "It was a bright cold day in April, and the clocks were striking thirteen.",
  "the boy who lived",
  "a hotel that doesn't want the family to leave, in winter",
];

export default function QuoteSearch({ onResultBookClick }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleSearch(e) {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/search-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Couldn't reach the search service. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="quote-search" className="qsearch">
      <div className="wrap qsearch-inner">
        <div className="qsearch-intro">
          <p className="qsearch-eyebrow">Search by memory, not metadata</p>
          <h2>Type any line. We'll find the book.</h2>
          <p className="qsearch-sub">
            A quote, a paraphrased line, even a vague scene you remember —
            our search reads it like a librarian would.
          </p>
        </div>

        <form className="qcard" onSubmit={handleSearch}>
          <label htmlFor="quote-input" className="qcard-label">
            What do you remember?
          </label>
          <textarea
            id="quote-input"
            className="qcard-input"
            placeholder='e.g. "it was the best of times, it was the worst of times" — or just describe the scene'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={3}
          />

          <div className="qcard-examples">
            {EXAMPLES.map((ex) => (
              <button
                type="button"
                key={ex}
                className="qcard-example-chip"
                onClick={() => setQuery(ex)}
              >
                “{ex.length > 42 ? ex.slice(0, 42) + "…" : ex}”
              </button>
            ))}
          </div>

          <button className="btn btn-primary qcard-submit" type="submit" disabled={loading}>
            {loading ? "Searching…" : "Find this book"}
          </button>
        </form>

        {error && <p className="qsearch-error">{error}</p>}

        {result && (
          <div className="qresult">
            {result.found ? (
              <>
                <div className="qresult-tag">
                  Match · {result.confidence || "medium"} confidence
                </div>
                <h3 className="qresult-title">{result.title}</h3>
                <p className="qresult-author">by {result.author}</p>
                <p className="qresult-summary">{result.summary}</p>

                {result.availability?.length > 0 && (
                  <div className="qresult-availability">
                    <span className="qresult-availability-label">
                      Where to find it:
                    </span>
                    <div className="qresult-availability-list">
                      {result.availability.map((place) => (
                        <span key={place} className="qresult-chip">
                          {place}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {result.note && <p className="qresult-note">{result.note}</p>}

                {result.catalogMatch && (
                  <button
                    className="btn btn-ghost qresult-view-btn"
                    onClick={() => onResultBookClick(result.catalogMatch)}
                  >
                    View in our catalog
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="qresult-tag qresult-tag-muted">No confident match</div>
                <p className="qresult-summary">
                  {result.note ||
                    "We couldn't confidently place that line. Try adding a few more words, or a detail about the setting or characters."}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
