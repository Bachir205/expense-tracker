const express = require('express');
const router  = express.Router();
const Budget  = require('../models/Budget');
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET /budgets
router.get('/', async (req, res) => {
  const now = new Date();
  const m   = req.query.month !== undefined ? Number(req.query.month) : now.getMonth();
  const y   = req.query.year  !== undefined ? Number(req.query.year)  : now.getFullYear();

  try {
    const budgets = await Budget.find({ user: req.user._id, month: m, year: y });
    const start   = new Date(y, m, 1);
    const end     = new Date(y, m + 1, 0, 23, 59, 59);

    const enriched = await Promise.all(budgets.map(async (b) => {
      const result = await Expense.aggregate([
        { $match: { user: req.user._id, category: b.category, type: 'expense', date: { $gte: start, $lte: end } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      const spent = result[0]?.total || 0;
      return { ...b.toObject(), spent, percentage: Math.round((spent / b.limit) * 100) };
    }));

    res.json({ budgets: enriched });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /budgets
router.post('/', async (req, res) => {
  try {
    const budget = await Budget.create({ ...req.body, user: req.user._id });
    res.status(201).json({ budget });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: 'Budget already exists for this category/month' });
    res.status(400).json({ message: err.message });
  }
});

// PUT /budgets/:id
router.put('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json({ budget });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /budgets/:id
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
