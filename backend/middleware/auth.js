// middleware/authenticate.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = (req, res, next) => {
  // 1. Extract token from header
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>"

  // 2. Verify signature and expiration
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach payload to request
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please log in again' });
    }
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = { protect };