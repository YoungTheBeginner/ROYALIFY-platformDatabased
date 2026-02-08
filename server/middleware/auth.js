const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    req.userIsPremium = decoded.isPremium;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.requireAdmin = (req, res, next) => {
  if (req.userRole !== 'admin' && !req.userIsPremium) {
    return res.status(403).json({ message: 'Premium membership required' });
  }
  next();
};
