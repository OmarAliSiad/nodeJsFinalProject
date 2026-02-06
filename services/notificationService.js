const Notification = require('../models/notificationModel');
const User = require('../models/userModel');

// Create a notification
const createNotification = async (notificationData) => {
    const { userId, type, relatedUserId, relatedPostId, relatedCommentId, message } = notificationData;

    // Don't create notification if user is notifying themselves
    if (userId.toString() === relatedUserId.toString()) {
        return null;
    }

    const notification = await Notification.create({
        userId,
        type,
        relatedUserId,
        relatedPostId,
        relatedCommentId,
        message
    });

    return notification;
};

// Get user's notifications with pagination
const getUserNotifications = async (userId, query = {}) => {
    const { limit = 10, page = 1, read } = query;
    const skip = (page - 1) * limit;

    const filter = { userId };
    if (read !== undefined) {
        filter.read = read === 'true' || read === true;
    }

    const notifications = await Notification.find(filter)
        .populate('relatedUserId', 'name email profilePicture')
        .populate('relatedPostId', 'title')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ userId, read: false });

    return {
        notifications,
        unreadCount,
        pagination: {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit)
        }
    };
};

// Mark notification as read
const markAsRead = async (notificationId, userId) => {
    const notification = await Notification.findOne({ _id: notificationId, userId });

    if (!notification) {
        throw new Error('Notification not found');
    }

    notification.read = true;
    await notification.save();

    return notification;
};

// Mark all notifications as read
const markAllAsRead = async (userId) => {
    const result = await Notification.updateMany(
        { userId, read: false },
        { $set: { read: true } }
    );

    return result.modifiedCount;
};

// Delete a notification
const deleteNotification = async (notificationId, userId) => {
    const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        userId
    });

    if (!notification) {
        throw new Error('Notification not found');
    }

    return notification;
};

// Helper functions to create specific notification types

const createCommentNotification = async (postAuthorId, commentAuthorId, postId, commentId) => {
    const commentAuthor = await User.findById(commentAuthorId);
    const message = `${commentAuthor.name} commented on your post`;

    return createNotification({
        userId: postAuthorId,
        type: 'comment',
        relatedUserId: commentAuthorId,
        relatedPostId: postId,
        relatedCommentId: commentId,
        message
    });
};

const createLikeNotification = async (postAuthorId, likerId, postId) => {
    const liker = await User.findById(likerId);
    const message = `${liker.name} liked your post`;

    return createNotification({
        userId: postAuthorId,
        type: 'like',
        relatedUserId: likerId,
        relatedPostId: postId,
        message
    });
};

const createFollowNotification = async (followedUserId, followerId) => {
    const follower = await User.findById(followerId);
    const message = `${follower.name} started following you`;

    return createNotification({
        userId: followedUserId,
        type: 'follow',
        relatedUserId: followerId,
        message
    });
};

const createReplyNotification = async (commentAuthorId, replierId, postId, replyId) => {
    const replier = await User.findById(replierId);
    const message = `${replier.name} replied to your comment`;

    return createNotification({
        userId: commentAuthorId,
        type: 'reply',
        relatedUserId: replierId,
        relatedPostId: postId,
        relatedCommentId: replyId,
        message
    });
};

module.exports = {
    createNotification,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createCommentNotification,
    createLikeNotification,
    createFollowNotification,
    createReplyNotification
};
