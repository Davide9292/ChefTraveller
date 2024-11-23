// server/middleware/staffAuthMiddleware.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    console.log(req.user)
    console.log(decoded)
    console.log('User role:', req.user.role)
    // Check if the user has the 'staff' role
    if (req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticate;