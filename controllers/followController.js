const followService = require('../services/followService');
const notificationService = require('../services/notificationService');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Follow a user
const followUser = asyncHandler(async (req, res, next) => {
    const followerId = req.user.userId || req.user.id;
    const followingId = req.params.userId;

    const follow = await followService.followUser(followerId, followingId);

    // Create notification for the followed user
    await notificationService.createFollowNotification(followingId, followerId);
    res.status(201).json({
        message: 'User followed successfully',
        follow
    });
});

// Unfollow a user
const unfollowUser = asyncHandler(async (req, res, next) => {
    const followerId = req.user.userId || req.user.id;
    const followingId = req.params.userId;

    await followService.unfollowUser(followerId, followingId);

    res.status(200).json({
        message: 'User unfollowed successfully'
    });
});

// Get user's followers
const getFollowers = asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;
    const { limit, page } = req.query;

    const result = await followService.getFollowers(
        userId,
        parseInt(limit) || 10,
        parseInt(page) || 1
    );

    res.status(200).json(result);
});

// Get users that this user is following
const getFollowing = asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;
    const { limit, page } = req.query;

    const result = await followService.getFollowing(
        userId,
        parseInt(limit) || 10,
        parseInt(page) || 1
    );

    res.status(200).json(result);
});

// Get follow counts
const getFollowCounts = asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;

    const counts = await followService.getFollowCounts(userId);

    res.status(200).json(counts);
});

module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getFollowCounts
};
