const mongoose = require('mongoose');

const CATEGORIES = ['Food','Transport','Housing','Entertainment','Health','Shopping','Education','Travel','Other'];

const ExpenseSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:    { type: String, required: [true, 'Title is required'], trim: true, maxlength: 100 },
  amount:   { type: Number, required: [true, 'Amount is required'], min: [0.01, 'Amount must be positive'] },
  type:     { type: String, enum: ['expense', 'income'], default: 'expense' },
  category: { type: String, required: [true, 'Category is required'], enum: CATEGORIES },
  tags:     [{ type: String, trim: true, maxlength: 30 }],
  note:     { type: String, trim: true, maxlength: 500 },
  date:     { type: Date, default: Date.now },
}, { timestamps: true });

// Index for fast user+date queries
ExpenseSchema.index({ user: 1, date: -1 });
ExpenseSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Expense', ExpenseSchema);
