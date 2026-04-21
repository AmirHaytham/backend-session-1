const express = require('express');
const router  = express.Router();
const Author  = require('../models/Author');

// GET /api/v1/authors — Get all authors (pagination + filtering)
// Query params: ?page=1&limit=10&name=<partial>&nationality=Egyptian
router.get('/', async (req, res, next) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    const filter = {};
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: 'i' };   // case-insensitive partial
    }
    if (req.query.nationality) {
      filter.nationality = req.query.nationality;                 // exact match
    }

    const total   = await Author.countDocuments(filter);
    const authors = await Author.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      count: authors.length,
      data: authors,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/authors/:id — Get a single author
router.get('/:id', async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ success: false, message: 'Author not found' });
    }
    res.json({ success: true, data: author });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/authors — Create a new author
router.post('/', async (req, res, next) => {
  try {
    const author = await Author.create(req.body);
    res.status(201).json({ success: true, data: author });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/authors/:id — Full update (all fields required)
router.put('/:id', async (req, res, next) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!author) {
      return res.status(404).json({ success: false, message: 'Author not found' });
    }
    res.json({ success: true, data: author });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/authors/:id — Partial update
router.patch('/:id', async (req, res, next) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!author) {
      return res.status(404).json({ success: false, message: 'Author not found' });
    }
    res.json({ success: true, data: author });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/authors/:id — Delete an author
router.delete('/:id', async (req, res, next) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) {
      return res.status(404).json({ success: false, message: 'Author not found' });
    }
    res.json({ success: true, message: 'Author deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
