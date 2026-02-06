const Follow = require('../models/followModel');
const User = require('../models/userModel');

// Follow a user
const followUser = async (followerId, followingId) => {
    // Prevent self-follow
    if (followerId === followingId) {
        throw new Error('Cannot follow yourself');
    }

    // Check if already following
    const existingFollow = await Follow.findOne({ followerId, followingId });
    if (existingFollow) {
        throw new Error('Already following this user');
    }

    // Check if followingId user exists
    const userToFollow = await User.findById(followingId);
    if (!userToFollow) {
        throw new Error('User to follow not found');
    }

    const follow = await Follow.create({ followerId, followingId });
    return follow;
};

// Unfollow a user
const unfollowUser = async (followerId, followingId) => {
    const follow = await Follow.findOneAndDelete({ followerId, followingId });
    if (!follow) {
        throw new Error('You are not following this user');
    }
    return follow;
};

// Get user's followers (users who follow this user)
const getFollowers = async (userId, limit = 10, page = 1) => {
    const skip = (page - 1) * limit;

    const followers = await Follow.find({ followingId: userId })
        .populate('followerId', 'name email profilePicture')
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });

    const total = await Follow.countDocuments({ followingId: userId });

    return {
        followers: followers.map(f => f.followerId),
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

// Get users that this user is following
const getFollowing = async (userId, limit = 10, page = 1) => {
    const skip = (page - 1) * limit;

    const following = await Follow.find({ followerId: userId })
        .populate('followingId', 'name email profilePicture')
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });

    const total = await Follow.countDocuments({ followerId: userId });

    return {
        following: following.map(f => f.followingId),
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

// Get follower and following counts for a user
const getFollowCounts = async (userId) => {
    const followersCount = await Follow.countDocuments({ followingId: userId });
    const followingCount = await Follow.countDocuments({ followerId: userId });

    return {
        followersCount,
        followingCount
    };
};

// Check if user A is following user B
const isFollowing = async (followerId, followingId) => {
    const follow = await Follow.findOne({ followerId, followingId });
    return !!follow;
};

module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getFollowCounts,
    isFollowing
};
