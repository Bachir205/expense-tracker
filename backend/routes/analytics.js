const express = require('express');
const router  = express.Router();
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

router.use(protect);

// GET /analytics/summary
router.get('/summary', async (req, res) => {
  const now   = new Date();
  const month = req.query.month !== undefined ? Number(req.query.month) : now.getMonth();
  const year  = req.query.year  !== undefined ? Number(req.query.year)  : now.getFullYear();
  const start = new Date(year, month, 1);
  const end   = new Date(year, month + 1, 0, 23, 59, 59);

  try {
    const [summary] = await Expense.aggregate([
      { $match: { user: req.user._id, date: { $gte: start, $lte: end } } },
      { $group: {
          _id: null,
          totalExpenses: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
          totalIncome:   { $sum: { $cond: [{ $eq: ['$type', 'income']  }, '$amount', 0] } },
          count: { $sum: 1 }
      }}
    ]);

    res.json({
      totalExpenses: summary?.totalExpenses || 0,
      totalIncome:   summary?.totalIncome   || 0,
      balance:      (summary?.totalIncome || 0) - (summary?.totalExpenses || 0),
      count:         summary?.count || 0,
      month, year
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /analytics/by-category
router.get('/by-category', async (req, res) => {
  const now   = new Date();
  const month = req.query.month !== undefined ? Number(req.query.month) : now.getMonth();
  const year  = req.query.year  !== undefined ? Number(req.query.year)  : now.getFullYear();
  const start = new Date(year, month, 1);
  const end   = new Date(year, month + 1, 0, 23, 59, 59);

  try {
    const data = await Expense.aggregate([
      { $match: { user: req.user._id, type: 'expense', date: { $gte: start, $lte: end } } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /analytics/trend
router.get('/trend', async (req, res) => {
  const months = Number(req.query.months) || 6;
  const now    = new Date();
  const start  = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

  try {
    const data = await Expense.aggregate([
      { $match: { user: req.user._id, date: { $gte: start } } },
      { $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' }, type: '$type' },
          total: { $sum: '$amount' }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
