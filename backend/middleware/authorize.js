// middleware/authorize.js
const authorize = (...roles) => {
  return (req, res, next) => {
    // authenticate middleware must run first (req.user must exist)
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Requires role: ${roles.join(' or ')}`,
      });
    }

    next();
  };
};

module.exports = authorize;