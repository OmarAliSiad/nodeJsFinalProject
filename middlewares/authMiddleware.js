/*
POST /comments - Create comment (authenticated)
GET /comments - Get all comments (with optional postId filter)
GET /comments/:id - Get comment by ID
PATCH /comments/:id - Update comment (author only)
DELETE /comments/:id - Delete comment (author or post author)
GET /posts/:postId/comments - Get comments for a specific post
*/
// make auth middleware to protect routes

const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');
const AppError = require('../utils/AppError.js');
const asyncHandler = require('../utils/asyncHandler.js');

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new AppError('Unauthorized: No token provided', 401));
        }
        const token = authHeader.split(' ')[1];
        const decodedData = jwt.verify(token, process.env.JWT_SECRET); // استخدم process.env
        console.log('🔍 Decoded Token Data:', decodedData); // شوف إيه اللي جوا الـ token
        console.log('🔍 Name from token:', decodedData.name); // شوف الـ name موجود ولا لأ
        req.user = {
            userId: decodedData.id,
            role: decodedData.role,
            name: decodedData.name,// Added name to req.user
            email: decodedData.email // Added email to req.user
        }
        next();
    }
    catch (error) {
        return next(new AppError('Unauthorized: Invalid or expired token', 401));
    }
}

module.exports = authenticate;