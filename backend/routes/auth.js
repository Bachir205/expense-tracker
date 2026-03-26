const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// POST /auth/register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, currency } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const user  = await User.create({ name, email, password, currency });
    const token = signToken(user._id);
    res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email, currency: user.currency } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    const token = signToken(user._id);
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, currency: user.currency } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

// PUT /auth/me
router.put('/me', protect, async (req, res) => {
  const { name, currency } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, currency },
      { new: true, runValidators: true }
    );
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
