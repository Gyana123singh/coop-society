const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const { errorResponse } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 401, 'Access denied. Authorization token missing.');
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return errorResponse(res, 401, 'User associated with this token no longer exists.');
    }

    if (user.status !== 'ACTIVE') {
      return errorResponse(res, 403, 'Account is inactive or blocked. Please contact support.');
    }

    req.user = user;
    next();
  } catch (err) {
    return errorResponse(res, 401, 'Invalid or expired token.');
  }
};

module.exports = { protect };
