require('dotenv').config();
const express   = require('express');
const connectDB = require('./config/db');

const bookRoutes   = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');
const errorHandler = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────
app.use('/api/v1/books',   bookRoutes);
app.use('/api/v1/authors', authorRoutes);

// Health-check
app.get('/', (req, res) => {
  res.json({ message: 'BookStore API is running!' });
});

// ── Centralized error handler (must be last) ──────────────────────
app.use(errorHandler);

// ── Connect to DB, then start server ─────────────────────────────
connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
