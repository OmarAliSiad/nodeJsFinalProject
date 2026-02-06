// Requirements
// Create multiple rate limiters in middlewares/rateLimiter.js:
// Authentication rate limiter: 5 requests per 15 minutes
// Password reset rate limiter: 3 requests per hour
// General API rate limiter: 100 requests per 15 minutes
// File upload rate limiter: 10 requests per hour
// Apply appropriate rate limiters to specific routes
// Update existing rate limiter implementation
const rateLimit = require('express-rate-limit');

const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes'
});

const passwordResetRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 3,
    message: 'Too many password reset requests from this IP, please try again after an hour'
});

const generalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

const fileUploadRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 10,
    message: 'Too many file upload requests from this IP, please try again after an hour'
});

module.exports = {
    authRateLimiter,
    passwordResetRateLimiter,
    generalRateLimiter,
    fileUploadRateLimiter
};  