const express = require('express');
const router  = express.Router();
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET /expenses
router.get('/', async (req, res) => {
  const { category, type, startDate, endDate, tags, page = 1, limit = 20 } = req.query;
  const query = { user: req.user._id };

  if (category) query.category = category;
  if (type)     query.type     = type;
  if (tags)     query.tags     = { $in: tags.split(',') };
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate)   query.date.$lte = new Date(endDate);
  }

  try {
    const total    = await Expense.countDocuments(query);
    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ expenses, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /expenses
router.post('/', async (req, res) => {
  try {
    const expense = await Expense.create({ ...req.body, user: req.user._id });
    res.status(201).json({ expense });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /expenses/:id
router.put('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    Object.assign(expense, req.body);
    await expense.save();
    res.json({ expense });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /expenses/:id
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
