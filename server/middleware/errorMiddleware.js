import { sendError } from '../utils/responseHandler.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return sendError(res, 404, 'Resource not found');
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return sendError(res, 400, 'Duplicate field value entered');
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    return sendError(res, 400, message);
  }

  console.error(err.stack);
  
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
