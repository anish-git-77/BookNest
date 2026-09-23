# 📖 BookNest — Book Recommendation Website

A full-stack book recommendation site:

- **Frontend:** React + Vite — a responsive, animated book-browsing UI
- **Backend:** Node + Express — serves the book catalog and powers "search by quote"
- **AI search:** Google Gemini API identifies a book from a quote, a paraphrased line,
  or even a vague description of a scene

Features:
- Browse the full book catalog with cover-style cards
- Filter books by genre (pill buttons) and search by title/author
- Click any book for a detail view with a summary and where to find it
- **Search by line/quote** — type anything you remember and Gemini identifies the
  book, gives a short summary, and where it's available

---

## 📁 Project structure

```
booknest/
├── backend/              Express API server
│   ├── data/books.json   The book catalog (edit this to add/change books)
│   ├── server.js         API routes + Gemini integration
│   ├── .env               <-- PASTE YOUR GEMINI API KEY HERE
│   └── package.json
└── frontend/              React + Vite app
    ├── src/
    │   ├── App.jsx
    │   └── components/
    └── package.json
```

---

## 🔑 Where to paste your Gemini API key

1. Get a free key at **https://aistudio.google.com/app/apikey**
2. Open **`backend/.env`** (already created for you)
3. Paste your key so the line looks like:

```
GEMINI_API_KEY=AIzaSy...your_real_key_here
```

4. Save the file and (re)start the backend server.

If you ever lose the `.env` file, copy `backend/.env.example` to `backend/.env` and
paste your key the same way. The rest of the site (browsing, genre filters) works
fully without a key — only the "search by a line" feature needs it.

---

## ▶️ How to run it

You need **Node.js 18+** installed. Open two terminals.

**Terminal 1 — backend:**
```bash
cd backend
npm install
npm start
```
This starts the API at `http://localhost:5000`.

**Terminal 2 — frontend:**
```bash
cd frontend
npm install
npm run dev
```
This starts the site at `http://localhost:5173` — open that URL in your browser.

The frontend is already configured (in `vite.config.js`) to forward any `/api/...`
request to the backend on port 5000, so you don't need to change any URLs.

---

## 🛠 Customizing

- **Add/edit books:** edit `backend/data/books.json`. Each book needs `title`,
  `author`, `genre`, `year`, `rating`, `summary`, `coverColor` (a hex color used
  for the card's cover block), and `availability` (an array of strings).
- **Change the AI model:** in `backend/server.js`, edit the `GEMINI_MODEL` constant.
- **Change colors/fonts:** edit the CSS variables at the top of
  `frontend/src/index.css`.

---

## 📦 Building for production

```bash
cd frontend
npm run build
```
This outputs a static site in `frontend/dist` that you can host anywhere
(Netlify, Vercel, etc.) — just make sure it can still reach your backend's
`/api` routes (update the proxy or add a full backend URL if hosting separately).

For the backend, deploy `backend/` to any Node host (Render, Railway, Fly.io, a
VPS, etc.) and set the `GEMINI_API_KEY` environment variable there instead of
using the `.env` file.
