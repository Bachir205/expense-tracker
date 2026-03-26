const mongoose = require('mongoose');

const CATEGORIES = ['Food','Transport','Housing','Entertainment','Health','Shopping','Education','Travel','Other'];

const BudgetSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true, enum: CATEGORIES },
  limit:    { type: Number, required: true, min: [1, 'Limit must be positive'] },
  month:    { type: Number, required: true, min: 0, max: 11 },
  year:     { type: Number, required: true },
  alertAt:  { type: Number, default: 80, min: 1, max: 100 },
}, { timestamps: true });

// Prevent duplicate budgets for same category/month/year
BudgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);
