// Create controllers/likes.js
// Implement controller functions that call service functions

const likeService = require('../services/likeService.js');
const notificationService = require('../services/notificationService');
const AppError = require('../utils/AppError.js');
const asyncHandler = require('../utils/asyncHandler.js');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

const toggleLike = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    let { targetType, targetId } = req.body;
    targetType = String(targetType).charAt(0).toUpperCase() + String(targetType).slice(1).toLowerCase();
    if (!['Post', 'Comment'].includes(targetType)) {
        throw new AppError('Invalid targetType. Must be "Post" or "Comment".', 400);
    }
    const result = await likeService.toggleLike(userId, targetType, targetId);

    // Create notification if like was added (not removed)
    if (result.message && result.message.includes('added')) {
        if (targetType === 'Post') {
            const post = await Post.findById(targetId);
            if (post && post.userId) {
                await notificationService.createLikeNotification(
                    post.userId,
                    userId,
                    targetId
                );
            }
        }
        // Note: You can also add notification for comment likes if needed
    }

    res.status(200).json(result);
});

const getLikesCount = asyncHandler(async (req, res) => {
    let { targetType, targetId } = req.query;
    targetType = String(targetType).charAt(0).toUpperCase() + String(targetType).slice(1).toLowerCase();
    console.log('Received targetType:', targetType);
    if (!['Post', 'Comment'].includes(targetType)) {
        throw new AppError('Invalid targetType. Must be "Post" or "Comment".', 400);
    }
    const count = await likeService.getLikesCount(targetType, targetId);
    res.status(200).json({ count });
});

const isLikedByUser = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    let { targetType, targetId } = req.query;
    targetType = String(targetType).charAt(0).toUpperCase() + String(targetType).slice(1).toLowerCase();
    if (!['Post', 'Comment'].includes(targetType)) {
        throw new AppError('Invalid targetType. Must be "Post" or "Comment".', 400);
    }

    const liked = await likeService.isLikedByUser(userId, targetType, targetId);
    res.status(200).json({ liked });
});

const getUserLikes = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    console.log('Fetching user' + req.user);
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const likesData = await likeService.getUserLikes(userId, limit, page);
    res.status(200).json(likesData);
});

module.exports = {
    toggleLike,
    getLikesCount,
    isLikedByUser,
    getUserLikes
};