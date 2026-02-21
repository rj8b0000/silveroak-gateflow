/**
 * Centralized Response Format
 */
export const sendResponse = (res, statusCode, message, data = null, success = true) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

export const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
