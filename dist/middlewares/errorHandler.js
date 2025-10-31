"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    console.error('Error:', err);
    // Handle JWT errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
    // Handle rate limit exceeded
    if (err.statusCode === 429) {
        return res.status(429).json({
            error: 'Too Many Requests',
            message: 'Rate limit exceeded. Please try again later.'
        });
    }
    // Handle payment required (word limit exceeded)
    if (err.statusCode === 402) {
        return res.status(402).json({
            error: 'Payment Required',
            message: 'Word limit reached. Please upgrade your plan or try again tomorrow.'
        });
    }
    // Default error handler
    res.status(err.statusCode || 500).json({
        error: err.message || 'Internal Server Error'
    });
}
