// server.js — BookNest backend
// Serves the book catalog, genre filtering, and a "search by quote/line" endpoint
// powered by Google's Gemini API.

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ⚠️ Paste your Gemini API key in backend/.env as GEMINI_API_KEY=your_key_here
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = "gemini-3.6-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

app.use(cors());
app.use(express.json());

// ---- Load book catalog ----
const booksPath = path.join(__dirname, "data", "books.json");
function loadBooks() {
  const raw = fs.readFileSync(booksPath, "utf-8");
  return JSON.parse(raw);
}

// ---- Routes ----

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: Boolean(GEMINI_API_KEY) });
});

// Get all books, optionally filtered by genre and/or a text query (title/author)
app.get("/api/books", (req, res) => {
  const { genre, q } = req.query;
  let books = loadBooks();

  if (genre && genre.toLowerCase() !== "all") {
    books = books.filter(
      (b) => b.genre.toLowerCase() === String(genre).toLowerCase()
    );
  }

  if (q) {
    const needle = String(q).toLowerCase();
    books = books.filter(
      (b) =>
        b.title.toLowerCase().includes(needle) ||
        b.author.toLowerCase().includes(needle)
    );
  }

  res.json({ count: books.length, books });
});

// Get the distinct list of genres
app.get("/api/genres", (req, res) => {
  const books = loadBooks();
  const genres = Array.from(new Set(books.map((b) => b.genre))).sort();
  res.json({ genres });
});

// Get a single book by id
app.get("/api/books/:id", (req, res) => {
  const books = loadBooks();
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

// Search by a quote, line, or vague description using Gemini
app.post("/api/search-quote", async (req, res) => {
  const { query } = req.body;

  if (!query || !query.trim()) {
    return res.status(400).json({ error: "Please provide some text to search for." });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({
      error:
        "Gemini API key is not configured on the server. Add GEMINI_API_KEY to backend/.env and restart the server.",
    });
  }

  const localBooks = loadBooks();
  const catalogTitles = localBooks.map((b) => `${b.title} by ${b.author}`).join("; ");

  const prompt = `You are a book identification assistant for a book recommendation website.
A user typed the following text, which may be a direct quote, a paraphrased line, or a vague description of a scene or theme from a book:

"""${query}"""

Identify the single most likely book this comes from (use your general knowledge, it does not have to be limited to any specific list). If you genuinely cannot identify a real book with reasonable confidence, say so.

Our site's own catalog currently includes these titles (mention if the match is one of these, but you are not limited to only these): ${catalogTitles}

Respond with STRICT JSON ONLY, no markdown fences, no commentary, matching exactly this shape:
{
  "found": true or false,
  "title": "string or empty string",
  "author": "string or empty string",
  "summary": "a concise 2-3 sentence spoiler-light summary, or empty string",
  "genre": "a single best-fit genre label, or empty string",
  "confidence": "high" or "medium" or "low",
  "availability": ["a short list of plausible places to find this book, e.g. Local Library, Amazon, Google Books, Audible, Barnes & Noble"],
  "note": "one short sentence, e.g. clarifying it's a common paraphrase, or empty string"
}`;

  try {
    // Gemini occasionally returns 503 (server overloaded) or 429 (rate limited),
    // both of which are transient — retry a couple of times with backoff before
    // giving up.
    const MAX_ATTEMPTS = 3;
    let response;
    let lastErrText = "";

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: "application/json",
          },
        }),
      });

      if (response.ok) break;

      lastErrText = await response.text();
      console.error(`Gemini API error (attempt ${attempt}/${MAX_ATTEMPTS}):`, response.status, lastErrText);

      const isTransient = response.status === 503 || response.status === 429;
      if (!isTransient || attempt === MAX_ATTEMPTS) break;

      // Backoff: ~700ms, then ~1400ms before retrying
      await new Promise((r) => setTimeout(r, 700 * attempt));
    }

    if (!response.ok) {
      const friendlyMessage =
        response.status === 503
          ? "Gemini's servers are temporarily overloaded. Please wait a few seconds and try your search again."
          : response.status === 429
          ? "You've hit the Gemini free-tier rate limit. Wait about a minute and try again."
          : "The AI search service returned an error. Check that your Gemini API key is valid and has quota remaining.";

      return res.status(502).json({ error: friendlyMessage });
    }

    const data = await response.json();
    const textOut = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    let parsed;
    try {
      const cleaned = textOut.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error("Failed to parse Gemini response:", textOut);
      return res.status(502).json({
        error: "Could not parse the AI response. Please try rephrasing your search.",
      });
    }

    // Cross-reference against our local catalog for a richer match, when possible
    if (parsed.found && parsed.title) {
      const match = localBooks.find(
        (b) => b.title.toLowerCase() === String(parsed.title).toLowerCase()
      );
      if (match) {
        parsed.catalogMatch = match;
      }
    }

    res.json(parsed);
  } catch (err) {
    console.error("Server error calling Gemini:", err);
    res.status(500).json({ error: "Something went wrong reaching the AI search service." });
  }
});

app.listen(PORT, () => {
  console.log(`📚 BookNest backend running on http://localhost:${PORT}`);
  if (!GEMINI_API_KEY) {
    console.log("⚠️  No GEMINI_API_KEY found. Add it to backend/.env to enable quote search.");
  }
});
