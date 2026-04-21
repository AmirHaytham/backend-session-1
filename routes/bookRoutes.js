const express = require('express');
const router  = express.Router();
const Book    = require('../models/Book');

// GET /api/v1/books — Get all books (pagination + filtering + sorting)
// Query params: ?page=1&limit=10&search=<text>&genre=Fiction&author=<name>
router.get('/', async (req, res, next) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    // Build filter object from query params
    const filter = {};
    if (req.query.search) {
      filter.$text = { $search: req.query.search };              // full-text search
    }
    if (req.query.genre) {
      filter.genre = req.query.genre;                            // exact match
    }
    if (req.query.author) {
      filter.author = { $regex: req.query.author, $options: 'i' }; // case-insensitive partial
    }

    const total = await Book.countDocuments(filter);
    const books = await Book.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();   // returns plain JS objects — faster for read-only responses

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      count: books.length,
      data: books,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/books/:id — Get a single book
router.get('/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/books — Create a new book
router.post('/', async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/books/:id — Full update (all fields required)
router.put('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/books/:id — Partial update (only provided fields)
router.patch('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, data: book });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/books/:id — Delete a book
router.delete('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, message: 'Book deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
