// Create services/likes.js
// Functions:
// toggleLike(userId, targetType, targetId) - Toggle like (like/unlike)
// getLikesCount(targetType, targetId) - Get total likes count
// isLikedByUser(userId, targetType, targetId) - Check if user liked
// getUserLikes(userId, query) - Get all likes by a user (with pagination)

const Like = require('../models/likesModel.js');

const toggleLike = async (userId, targetType, targetId) => {
    const existingLike = await Like.findOne({ userId, targetType, targetId }).populate('userId');
    if (existingLike) {
        await Like.deleteOne({
            _id: existingLike._id,
        });
        return {
            liked: false, userId,
            userName: existingLike.userId.name
        };
    } else {
        const newLike = await Like({ userId, targetType, targetId });
        await newLike.save();
        const populatedLike = await newLike.populate('userId');
        return {
            liked: true,
            userId,
            userName: populatedLike.userId.name
        };
    }
};

const getLikesCount = async (targetType, targetId) => {
    return await Like.countDocuments({ targetType, targetId });
};

const isLikedByUser = async (userId, targetType, targetId) => {
    const like = await Like.findOne({ userId, targetType, targetId }).populate('userId');
    return {
        liked: (like !== null),
        userId,
        userName: like ? like.userId.name : null
    };
};

const getUserLikes = async (userId, limit = 10, page = 1) => {
    const skip = (page - 1) * limit;
    const likes = await Like.find({ userId }).limit(limit).skip(skip);
    const total = await Like.countDocuments({ userId });
    return {
        likes,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
}

module.exports = {
    toggleLike,
    getLikesCount,
    isLikedByUser,
    getUserLikes
};