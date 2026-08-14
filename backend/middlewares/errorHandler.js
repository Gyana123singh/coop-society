const { errorResponse } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('[Error Handler]', err);

  // Mongoose Bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    return errorResponse(res, 404, message);
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for ${field} field.`;
    return errorResponse(res, 400, message);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return errorResponse(res, 400, message);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 401, 'Invalid authentication token');
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 401, 'Authentication token has expired');
  }

  return errorResponse(
    res, 
    error.statusCode || 500, 
    error.message || 'Server Internal Error'
  );
};

module.exports = errorHandler;
