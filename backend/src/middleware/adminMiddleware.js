const logger = require('../utils/logger');

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  if (!req.user.isAdmin) {
    logger.warn(`Unauthorized admin access attempt by ${req.user.email}`);
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

module.exports = { requireAdmin };
