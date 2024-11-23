const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  console.log('Token being verified:', token); // Add this line
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    console.log('Token:', token);
    console.log('Secret key:', process.env.ACCESS_TOKEN_SECRET);
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log('Decoded token:', decoded);

    req.user = decoded;

    console.log('req.user:', req.user);

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticate;